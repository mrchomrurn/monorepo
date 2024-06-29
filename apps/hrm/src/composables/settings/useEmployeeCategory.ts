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
  cateName: z.string().min(1, 'Required').describe('Category Name'),
  cateDes: z.string().describe('Category Description').nullish(),
})

export type EmployeeCategorySchema = z.infer<typeof schema>

export interface EmployeeCategory {
  cateId: string
  cateName: string
  cateDes?: string
}

interface Edit { body: EmployeeCategorySchema, id: string }

const fetchEmployeeCategory = async (options?: FilterOptions) => {
  const { data: result } = await api.post<ListResponse<EmployeeCategory>>('/api/category/filter', options || {})
  return result.data
}

const fetchEmployeeCategoryById = async (categoryId: string) => {
  const { data: result } = await api.post<DetailResponse<EmployeeCategory>>(`/api/category/id/${categoryId}`)
  return result.data
}

const createEmployeeCategory = async (body: EmployeeCategorySchema) => {
  const { data } = await api.post<CreateResponse>('/api/category/save', body)
  return data
}

const editEmployeeCategory = async ({ body, id }: Edit) => {
  const { data } = await api.post<MessageResponse>(`/api/category/save/${id}`, body)
  return data
}

const deleteEmployeeCategory = async (categoryId: string) => {
  const { data } = await api.post<MessageResponse>(`/api/category/delete/${categoryId}`)
  return data
}

const employeeCategoryKeys = {
  list: () => ['employee-category-list'] as const,
  filter: (filters?: Ref<FilterOptions>) => [...employeeCategoryKeys.list(), filters] as const,
  detail: (id: string) => ['employee-category-detail', id] as const,
}

export const categoriesOptions = (options?: Ref<FilterOptions>) => {
  const filterKeys = computed(() => ({ ...defaultListFilter, ...options?.value }))
  return queryOptions({
    queryKey: employeeCategoryKeys.filter(filterKeys),
    queryFn: () => fetchEmployeeCategory(filterKeys.value),
  })
}

export const useEmployeeCategory = () => {
  const { toast } = useToast()
  const client = useQueryClient()
  const fileComposable = useFile({ apiName: 'category', queryKey: employeeCategoryKeys.list() })

  const listQuery = (options?: Ref<FilterOptions>) => {
    return useQuery(categoriesOptions(options))
  }

  const getByIdQuery = (categoryId: string) => useQuery({
    queryKey: employeeCategoryKeys.detail(categoryId),
    queryFn: () => fetchEmployeeCategoryById(categoryId),
    enabled: !!categoryId,
  })

  const createMutation = () => useMutation({
    mutationFn: createEmployeeCategory,
    onSuccess: (res, body) => {
      client.setQueryData(employeeCategoryKeys.detail(res.data.id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: employeeCategoryKeys.list() }),
  })

  const editMutation = () => useMutation({
    mutationFn: editEmployeeCategory,
    onSuccess: async (res, { body, id }) => {
      client.setQueryData(employeeCategoryKeys.detail(id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: async () => client.invalidateQueries({ queryKey: employeeCategoryKeys.list() }),
  })

  const deleteQuery = () => useMutation({
    mutationFn: deleteEmployeeCategory,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: employeeCategoryKeys.list() }),
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
