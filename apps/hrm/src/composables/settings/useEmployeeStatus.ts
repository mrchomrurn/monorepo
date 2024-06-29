import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { type Ref, computed } from 'vue'
import { capitalize } from 'lodash-es'
import { z } from 'zod'

import { api } from '@/services/api'
import type { CreateResponse, DetailResponse, ListResponse, MessageResponse } from '@/types/ApiResponse'
import { useToast } from '@/components/ui/toast'
import type { FilterOptions } from '@/lib/constants'
import { defaultListFilter } from '@/lib/constants'
import { useFile } from '@/composables/useFile'

export const schema = z.object({
  statusName: z.string().min(1, 'Required').describe('Status Name'),
  statusDes: z.string().describe('Status Description').nullish(),
})

export type EmployeeStatusSchema = z.infer<typeof schema>

export interface EmployeeStatus {
  statusId: string
  statusName: string
  statusDes?: string
}

interface Edit { body: EmployeeStatusSchema, id: string }

const fetchEmployeeStatus = async (options?: FilterOptions) => {
  const { data: result } = await api.post<ListResponse<EmployeeStatus>>('/api/status/filter', options || {})
  return result.data
}

const fetchEmployeeStatusById = async (statusId: string) => {
  const { data: result } = await api.post<DetailResponse<EmployeeStatus>>(`/api/status/id/${statusId}`)
  return result.data
}

const createEmployeeStatus = async (body: EmployeeStatusSchema) => {
  const { data } = await api.post<CreateResponse>('/api/status/save', body)
  return data
}

const editEmployeeStatus = async ({ body, id }: Edit) => {
  const { data } = await api.post<MessageResponse>(`/api/status/save/${id}`, body)
  return data
}

const deleteEmployeeStatus = async (statusId: string) => {
  const { data } = await api.post<MessageResponse>(`/api/status/delete/${statusId}`)
  return data
}

const employeeStatusKeys = {
  list: () => ['employee-status-list'] as const,
  filter: (filters?: Ref<FilterOptions>) => [...employeeStatusKeys.list(), filters] as const,
  detail: (id: string) => ['employee-status-detail', id] as const,
}

export const useEmployeeStatus = () => {
  const { toast } = useToast()
  const client = useQueryClient()
  const fileComposable = useFile({ apiName: 'status', queryKey: employeeStatusKeys.list() })

  const listQuery = (options?: Ref<FilterOptions>) => {
    const filterKeys = computed(() => ({ ...defaultListFilter, ...options?.value }))
    return useQuery({
      queryKey: employeeStatusKeys.filter(filterKeys),
      queryFn: () => fetchEmployeeStatus(filterKeys.value),
    })
  }

  const getByIdQuery = (statusId: string) => useQuery({
    queryKey: employeeStatusKeys.detail(statusId),
    queryFn: () => fetchEmployeeStatusById(statusId),
    enabled: !!statusId,
  })

  const createMutation = () => useMutation({
    mutationFn: createEmployeeStatus,
    onSuccess: (res, body) => {
      client.setQueryData(employeeStatusKeys.detail(res.data.id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: employeeStatusKeys.list() }),
  })

  const editMutation = () => useMutation({
    mutationFn: editEmployeeStatus,
    onSuccess: async (res, { body, id }) => {
      client.setQueryData(['employee-status-detail', body], id)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: async () => client.invalidateQueries({ queryKey: employeeStatusKeys.list() }),
  })

  const deleteQuery = () => useMutation({
    mutationFn: deleteEmployeeStatus,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: employeeStatusKeys.list() }),
  })

  return {
    listQuery,
    getByIdQuery,
    createMutation,
    deleteQuery,
    editMutation,
    ...fileComposable,
  }
}
