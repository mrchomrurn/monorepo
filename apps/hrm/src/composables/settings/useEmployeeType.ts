import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { capitalize } from 'lodash-es'
import { type Ref, computed } from 'vue'
import { z } from 'zod'

import { useFile } from '../useFile'
import { useToast } from '@/components/ui/toast'
import type { FilterOptions } from '@/lib/constants'
import { defaultListFilter } from '@/lib/constants'
import { api } from '@/services/api'
import type { CreateResponse, DetailResponse, ListResponse, MessageResponse } from '@/types/ApiResponse'

export const schema = z.object({
  typeName: z.string().min(1, 'Required').describe('Type Name'),
  typeDes: z.string().describe('Type Description').nullish(),
})

export type EmployeeTypeSchema = z.infer<typeof schema>

export interface EmployeeType {
  typeId: string
  typeName: string
  typeDes?: string
}

interface Edit { body: EmployeeTypeSchema, id: string }

const fetchEmployeeType = async (options?: FilterOptions) => {
  const { data: result } = await api.post<ListResponse<EmployeeType>>('/api/type/filter', options || {})
  return result.data
}

const fetchEmployeeTypeById = async (typeId: string) => {
  const { data: result } = await api.post<DetailResponse<EmployeeType>>(`/api/type/id/${typeId}`)
  return result.data
}

const createEmployeeType = async (body: EmployeeTypeSchema) => {
  const { data } = await api.post<CreateResponse>('/api/type/save', body)
  return data
}

const editEmployeeType = async ({ body, id }: Edit) => {
  const { data } = await api.post<MessageResponse>(`/api/type/save/${id}`, body)
  return data
}

const deleteEmployeeType = async (typeId: string) => {
  const { data } = await api.post<MessageResponse>(`/api/type/delete/${typeId}`)
  return data
}

const employeeTypeKeys = {
  list: () => ['employee-type-list'] as const,
  filter: (filters?: Ref<FilterOptions>) => [...employeeTypeKeys.list(), filters] as const,
  detail: (id: string) => ['employee-type-detail', id] as const,
}

export const typesOptions = (options?: Ref<FilterOptions>) => {
  const filterKeys = computed(() => ({ ...defaultListFilter, ...options?.value }))
  return queryOptions({
    queryKey: employeeTypeKeys.filter(filterKeys),
    queryFn: () => fetchEmployeeType(filterKeys.value),
  })
}

export const useEmployeeType = () => {
  const { toast } = useToast()
  const client = useQueryClient()
  const fileComposable = useFile({ apiName: 'type', queryKey: employeeTypeKeys.list() })

  const listQuery = (options?: Ref<FilterOptions>) => {
    return useQuery(typesOptions(options))
  }

  const getByIdQuery = (typeId: string) => useQuery({
    queryKey: employeeTypeKeys.detail(typeId),
    queryFn: () => fetchEmployeeTypeById(typeId),
    enabled: !!typeId,
  })

  const createMutation = () => useMutation({
    mutationFn: createEmployeeType,
    onSuccess: (res, body) => {
      client.setQueryData(employeeTypeKeys.detail(res.data.id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: employeeTypeKeys.list() }),
  })

  const editMutation = () => useMutation({
    mutationFn: editEmployeeType,
    onSuccess: async (res, { body, id }) => {
      client.setQueryData(employeeTypeKeys.detail(id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: async () => client.invalidateQueries({ queryKey: employeeTypeKeys.list() }),
  })

  const deleteQuery = () => useMutation({
    mutationFn: deleteEmployeeType,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: employeeTypeKeys.list() }),
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
