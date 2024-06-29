import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { capitalize } from 'lodash-es'
import { type Ref, computed } from 'vue'
import { z } from 'zod'

import { useToast } from '@/components/ui/toast'
import { type FilterOptions, defaultListFilter } from '@/lib/constants'
import { api } from '@/services/api'
import type { CreateResponse, DetailResponse, ListResponse, MessageResponse } from '@/types/ApiResponse'
import { useFile } from '@/composables/useFile'

export const schema = z.object({
  gradeName: z.string().describe('Grade Name').min(1, 'Required'),
  gradeDes: z.string().describe('Grade Description').nullish(),
})

export type EmployeeGradeSchema = z.infer<typeof schema>

export interface EmployeeGrade {
  gradeId: string
  gradeName: string
  gradeDes: string
}

const fetchEmployeeGrade = async (filters?: FilterOptions) => {
  const { data: result } = await api.post<ListResponse<EmployeeGrade>>('/api/grade/filter', filters || {})
  return result.data
}

const fetchEmployeeGradeById = async (gradeId: string) => {
  const { data: result } = await api.post<DetailResponse<EmployeeGrade>>(`/api/grade/id/${gradeId}`)
  return result.data
}

const createEmployeeGrade = async (body: EmployeeGradeSchema) => {
  const { data } = await api.post<CreateResponse>('/api/grade/save', body)
  return data
}

const editEmployeeGrade = async ({ body, id }: { body: EmployeeGradeSchema, id: string }) => {
  const { data } = await api.post<MessageResponse>(`/api/grade/save/${id}`, body)
  return data
}

const deleteEmployeeGrade = async (gradeId: string) => {
  const { data } = await api.post<MessageResponse>(`/api/grade/delete/${gradeId}`)
  return data
}

const gradeKeys = {
  list: () => ['employee-grade-list'] as const,
  filter: (filters?: Ref<FilterOptions>) => [...gradeKeys.list(), filters] as const,
  detail: (id: string) => ['employee-grade-detail', id] as const,
}

export const gradeOptions = (options?: Ref<FilterOptions>) => {
  const filterKeys = computed(() => ({ ...defaultListFilter, ...options?.value }))
  return queryOptions({
    queryKey: gradeKeys.filter(filterKeys),
    queryFn: () => fetchEmployeeGrade(filterKeys.value),
  })
}

export const useEmployeeGrade = () => {
  const client = useQueryClient()
  const { toast } = useToast()
  const fileComposable = useFile({ apiName: 'grade', queryKey: gradeKeys.list() })

  const listQuery = (options?: Ref<FilterOptions>) => {
    return useQuery(gradeOptions(options))
  }

  const getByIdQuery = (gradeId: string) => useQuery({
    queryKey: gradeKeys.detail(gradeId),
    queryFn: () => fetchEmployeeGradeById(gradeId),
    enabled: !!gradeId,
  })

  const createMutation = () => useMutation({
    mutationFn: createEmployeeGrade,
    onSuccess: (res, data) => {
      client.setQueryData(gradeKeys.detail(res.data.id), { ...data, phId: res?.data.id })
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: gradeKeys.list() })
    },
  })

  const editMutation = () => useMutation({
    mutationFn: editEmployeeGrade,
    onSuccess: (res, { body, id }) => {
      client.setQueryData(gradeKeys.detail(id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: gradeKeys.list() }),
  })

  const deleteQuery = () => useMutation({
    mutationFn: deleteEmployeeGrade,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: gradeKeys.list() }),
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
