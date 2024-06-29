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
  posName: z.string().min(1, 'Required').describe('Position Name'),
  posDes: z.string().describe('Position Description').nullish(),
})

export type EmployeePositionSchema = z.infer<typeof schema>

export interface EmployeePosition {
  posId: string
  posName: string
  posDes?: string
}

interface Edit { body: EmployeePositionSchema, id: string }

const fetchEmployeePosition = async (options?: FilterOptions) => {
  const { data: result } = await api.post<ListResponse<EmployeePosition>>('/api/position/filter', options || {})
  return result.data
}

const fetchEmployeePositionById = async (positionId: string) => {
  const { data: result } = await api.post<DetailResponse<EmployeePosition>>(`/api/position/id/${positionId}`)
  return result.data
}

const createEmployeePosition = async (body: EmployeePositionSchema) => {
  const { data } = await api.post<CreateResponse>('/api/position/save', body)
  return data
}

const editEmployeePosition = async ({ body, id }: Edit) => {
  const { data } = await api.post<MessageResponse>(`/api/position/save/${id}`, body)
  return data
}

const deleteEmployeePosition = async (positionId: string) => {
  const { data } = await api.post<MessageResponse>(`/api/position/delete/${positionId}`)
  return data
}

const employeePositionKeys = {
  list: () => ['employee-position-list'] as const,
  filter: (filters?: Ref<FilterOptions>) => [...employeePositionKeys.list(), filters] as const,
  detail: (id: string) => ['employee-position-detail', id] as const,
}

export const positionsOptions = (options?: Ref<FilterOptions>) => {
  const filterKeys = computed(() => ({ ...defaultListFilter, ...options?.value }))
  return queryOptions({
    queryKey: employeePositionKeys.filter(filterKeys),
    queryFn: () => fetchEmployeePosition(filterKeys.value),
  })
}

export const useEmployeePosition = () => {
  const { toast } = useToast()
  const client = useQueryClient()
  const fileComposable = useFile({ apiName: 'position', queryKey: employeePositionKeys.list() })

  const listQuery = (options?: Ref<FilterOptions>) => {
    return useQuery(positionsOptions(options))
  }

  const getByIdQuery = (positionId: string) => useQuery({
    queryKey: employeePositionKeys.detail(positionId),
    queryFn: () => fetchEmployeePositionById(positionId),
    enabled: !!positionId,
  })

  const createMutation = () => useMutation({
    mutationFn: createEmployeePosition,
    onSuccess: (res, body) => {
      client.setQueryData(employeePositionKeys.detail(res.data.id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: employeePositionKeys.list() }),
  })

  const editMutation = () => useMutation({
    mutationFn: editEmployeePosition,
    onSuccess: async (res, { body, id }) => {
      client.setQueryData(['employee-position-detail', id], body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: async () => client.invalidateQueries({ queryKey: employeePositionKeys.list() }),
  })

  const deleteQuery = () => useMutation({
    mutationFn: deleteEmployeePosition,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: employeePositionKeys.list() }),
  })

  return {
    listQuery,
    getByIdQuery,
    createMutation,
    editMutation,
    deleteQuery,
    ...fileComposable,
  }
}
