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
  depName: z.string().min(1, 'Required').describe('Department Name'),
  depDes: z.string().describe('Department Description').nullish(),
})

export type DepartmentSchema = z.infer<typeof schema>

export interface Department {
  depId: string
  depName: string
  depDes?: string
}

interface Edit { body: DepartmentSchema, id: string }

const fetchDepartment = async (options?: FilterOptions) => {
  const { data: result } = await api.post<ListResponse<Department>>('/api/department/filter', options || {})
  return result.data
}

const fetchDepartmentById = async (departmentId: string) => {
  const { data: result } = await api.post<DetailResponse<Department>>(`/api/department/id/${departmentId}`)
  return result.data
}

const createDepartment = async (body: DepartmentSchema) => {
  const { data } = await api.post<CreateResponse>('/api/department/save', body)
  return data
}

const editDepartment = async ({ body, id }: Edit) => {
  const { data } = await api.post<MessageResponse>(`/api/department/save/${id}`, body)
  return data
}

const deleteDepartment = async (departmentId: string) => {
  const { data } = await api.post<MessageResponse>(`/api/department/delete/${departmentId}`)
  return data
}

const departmentKeys = {
  list: () => ['department-list'] as const,
  filter: (filters?: Ref<FilterOptions>) => [...departmentKeys.list(), filters] as const,
  detail: (id: string) => ['department-detail', id] as const,
}

export const departmentsOptions = (options?: Ref<FilterOptions>) => {
  const filterKeys = computed(() => ({ ...defaultListFilter, ...options?.value }))
  return queryOptions({
    queryKey: departmentKeys.filter(filterKeys),
    queryFn: () => fetchDepartment(filterKeys.value),
  })
}

export const useDepartment = () => {
  const { toast } = useToast()
  const client = useQueryClient()
  const fileComposable = useFile({ apiName: 'deparment', queryKey: departmentKeys.list() })

  const listQuery = (options?: Ref<FilterOptions>) => {
    return useQuery(departmentsOptions(options))
  }

  const getByIdQuery = (depId: string) => useQuery({
    queryKey: departmentKeys.detail(depId),
    queryFn: () => fetchDepartmentById(depId),
    enabled: !!depId,
  })

  const createMutation = () => useMutation({
    mutationFn: createDepartment,
    onSuccess: (res, body) => {
      client.setQueryData(departmentKeys.detail(res.data.id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: departmentKeys.list() }),
  })

  const editMutation = () => useMutation({
    mutationFn: editDepartment,
    onSuccess: async (res, { body, id }) => {
      client.setQueryData(departmentKeys.detail(id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: async () => client.invalidateQueries({ queryKey: departmentKeys.list() }),
  })

  const deleteQuery = () => useMutation({
    mutationFn: deleteDepartment,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: departmentKeys.list() }),
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
