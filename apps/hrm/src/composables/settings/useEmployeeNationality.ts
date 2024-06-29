import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
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
  natName: z.string().min(1, 'Required').describe('Nationaltity Name'),
  natDes: z.string().describe('Nationaltity Description').nullish(),
})

export type EmployeeNationalitySchema = z.infer<typeof schema>
export type EmployeeNationality = EmployeeNationalitySchema & { natId: string }

interface Edit { body: EmployeeNationalitySchema, id: string }

const fetchEmployeeNationality = async (options?: FilterOptions) => {
  const { data: result } = await api.post<ListResponse<EmployeeNationality>>('/api/nationality/filter', options || {})
  return result.data
}

const fetchEmployeeNationalityById = async (nationalityId: string) => {
  const { data: result } = await api.post<DetailResponse<EmployeeNationality>>(`/api/nationality/id/${nationalityId}`)
  return result.data
}

const createEmployeeNationality = async (body: EmployeeNationalitySchema) => {
  const { data } = await api.post<CreateResponse>('/api/nationality/save', body)
  return data
}

const editEmployeeNationality = async ({ body, id }: Edit) => {
  const { data } = await api.post<MessageResponse>(`/api/nationality/save/${id}`, body)
  return data
}

const deleteEmployeeNationality = async (nationalityId: string) => {
  const { data } = await api.post<MessageResponse>(`/api/nationality/delete/${nationalityId}`)
  return data
}

const employeeNationalityKeys = {
  list: () => ['employee-nationality-list'] as const,
  filter: (filters?: Ref<FilterOptions>) => [...employeeNationalityKeys.list(), filters] as const,
  detail: (id: string) => ['employee-nationality-detail', id] as const,
}

export const employeeNationalityOptions = (options?: Ref<FilterOptions>) => {
  const filterKeys = computed(() => ({ ...defaultListFilter, ...options?.value }))
  return queryOptions({
    queryKey: employeeNationalityKeys.filter(filterKeys),
    queryFn: () => fetchEmployeeNationality(filterKeys.value),
  })
}

export const useEmployeeNationality = () => {
  const { toast } = useToast()
  const client = useQueryClient()
  const fileComposable = useFile({ apiName: 'nationality', queryKey: employeeNationalityKeys.list() })

  const listQuery = (options?: Ref<FilterOptions>) => {
    return useQuery(employeeNationalityOptions(options))
  }

  const getByIdQuery = (nationalityId: string) => useQuery({
    queryKey: employeeNationalityKeys.detail(nationalityId),
    queryFn: () => fetchEmployeeNationalityById(nationalityId),
    enabled: !!nationalityId,
  })

  const createMutation = () => useMutation({
    mutationFn: createEmployeeNationality,
    onSuccess: (res, body) => {
      client.setQueryData(employeeNationalityKeys.detail(res.data.id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: employeeNationalityKeys.list() }),
  })

  const editMutation = () => useMutation({
    mutationFn: editEmployeeNationality,
    onSuccess: async (res, { body, id }) => {
      client.setQueryData(employeeNationalityKeys.detail(id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: async () => client.invalidateQueries({ queryKey: employeeNationalityKeys.list() }),
  })

  const deleteQuery = () => useMutation({
    mutationFn: deleteEmployeeNationality,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: employeeNationalityKeys.list() }),
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
