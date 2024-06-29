import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { capitalize } from 'lodash-es'
import { type Ref, computed } from 'vue'
import { z } from 'zod'

import { useToast } from '@/components/ui/toast'
import { type FilterOptions, defaultListFilter } from '@/lib/constants'
import { api } from '@/services/api'
import type { CreateResponse, DetailResponse, ListResponse, MessageResponse } from '@/types/ApiResponse'
import { useFile } from '@/composables/useFile'
import { AssignmentTypes } from '@/composables/useAssignmentType'

export const schema = z.object({
  atName: z.string().describe('Name').min(1, 'Required'),
  atPayType: z.enum(['Fix', 'Percentage']).describe('Pay Type'),
  atPayValue: z.number({ invalid_type_error: 'Required' })
    .describe('Pay Value')
    .positive().int(),
  atPayMultiplier: z.number({ invalid_type_error: 'Required' })
    .describe('Pay Multiplier')
    .positive(),
  assignment: z.object({
    asmType: z.nativeEnum(AssignmentTypes).describe('Assignment Type'),
    details: z.array(z.string()).min(1, 'Required'),
  }),
  atDescription: z.string().describe('Description').nullish(),
})

export type AllowanceTypeSchema = z.infer<typeof schema>
export type AllowanceType = AllowanceTypeSchema & { atId: string }

export interface AllowanceTypeList {
  alwtId: string
  alwtName: string
}

const fetchAllowanceType = async (filters?: FilterOptions) => {
  const { data: result } = await api.post<ListResponse<AllowanceTypeList>>('/api/allowance-type/filter', filters || {})
  return result.data
}

const fetchAllowanceTypeById = async (allowanceTypeId: string) => {
  const { data: result } = await api.post<DetailResponse<AllowanceType>>(`/api/allowance-type/id/${allowanceTypeId}`)
  return result.data
}

const createAllowanceType = async (body: AllowanceTypeSchema) => {
  const { data } = await api.post<CreateResponse>('/api/allowance-type/save', body)
  return data
}

const editAllowanceType = async ({ body, id }: { body: AllowanceTypeSchema, id: string }) => {
  const { data } = await api.post<MessageResponse>(`/api/allowance-type/save/${id}`, body)
  return data
}

const deleteAllowanceType = async (allowanceTypeId: string) => {
  const { data } = await api.post<MessageResponse>(`/api/allowance-type/delete/${allowanceTypeId}`)
  return data
}

const allowanceTypeKeys = {
  list: () => ['allowance-type-list'] as const,
  filter: (filters?: Ref<FilterOptions>) => [...allowanceTypeKeys.list(), filters] as const,
  detail: (id: string) => ['allowance-type-detail', id] as const,
}

export const useAllowanceType = () => {
  const client = useQueryClient()
  const { toast } = useToast()
  const fileComposable = useFile({ apiName: 'allowance-type', queryKey: allowanceTypeKeys.list() })

  const listQuery = (options?: Ref<FilterOptions>) => {
    const filterKeys = computed(() => ({ ...defaultListFilter, ...options?.value }))
    return useQuery({
      queryKey: allowanceTypeKeys.filter(filterKeys),
      queryFn: ({ queryKey }) => fetchAllowanceType(queryKey[1]),
    })
  }

  const getByIdQuery = (allowanceTypeId: string) => useQuery({
    queryKey: allowanceTypeKeys.detail(allowanceTypeId),
    queryFn: () => fetchAllowanceTypeById(allowanceTypeId),
    enabled: !!allowanceTypeId,
  })

  const createMutation = () => useMutation({
    mutationFn: createAllowanceType,
    onSuccess: (res, data) => {
      client.setQueryData(allowanceTypeKeys.detail(res.data.id), { ...data, phId: res?.data.id })
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: allowanceTypeKeys.list() })
    },
  })

  const editMutation = () => useMutation({
    mutationFn: editAllowanceType,
    onSuccess: (res, { body, id }) => {
      client.setQueryData(allowanceTypeKeys.detail(id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: allowanceTypeKeys.list() }),
  })

  const deleteQuery = () => useMutation({
    mutationFn: deleteAllowanceType,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: allowanceTypeKeys.list() }),
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
