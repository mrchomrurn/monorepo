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
  msName: z.string().min(1, 'Required').describe('Marital Status Name'),
  msDes: z.string().describe('Marital Status Description').nullish(),
})

export type MaritalStatusSchema = z.infer<typeof schema>
export type MaritalStatus = MaritalStatusSchema & { msId: string }

interface Edit { body: MaritalStatusSchema, id: string }

const fetchMaritalStatus = async (options?: FilterOptions) => {
  const { data: result } = await api.post<ListResponse<MaritalStatus>>('/api/marital-status/filter', options || {})
  return result.data
}

const fetchMaritalStatusById = async (maritalStatusId: string) => {
  const { data: result } = await api.post<DetailResponse<MaritalStatus>>(`/api/marital-status/id/${maritalStatusId}`)
  return result.data
}

const createMaritalStatus = async (body: MaritalStatusSchema) => {
  const { data } = await api.post<CreateResponse>('/api/marital-status/save', body)
  return data
}

const editMaritalStatus = async ({ body, id }: Edit) => {
  const { data } = await api.post<MessageResponse>(`/api/marital-status/save/${id}`, body)
  return data
}

const deleteMaritalStatus = async (maritalStatusId: string) => {
  const { data } = await api.post<MessageResponse>(`/api/marital-status/delete/${maritalStatusId}`)
  return data
}

const maritalStatusKeys = {
  list: () => ['marital-status-list'] as const,
  filter: (filters?: Ref<FilterOptions>) => [...maritalStatusKeys.list(), filters] as const,
  detail: (id: string) => ['marital-status-detail', id] as const,
}

export const maritalStatusOptions = (options?: Ref<FilterOptions>) => {
  const filterKeys = computed(() => ({ ...defaultListFilter, ...options?.value }))
  return queryOptions({
    queryKey: maritalStatusKeys.filter(filterKeys),
    queryFn: () => fetchMaritalStatus(filterKeys.value),
  })
}

export const useMaritalStatus = () => {
  const { toast } = useToast()
  const client = useQueryClient()
  const fileComposable = useFile({ apiName: 'marital-status', queryKey: maritalStatusKeys.list() })

  const listQuery = (options?: Ref<FilterOptions>) => {
    return useQuery(maritalStatusOptions(options))
  }

  const getByIdQuery = (maritalStatusId: string) => useQuery({
    queryKey: maritalStatusKeys.detail(maritalStatusId),
    queryFn: () => fetchMaritalStatusById(maritalStatusId),
    enabled: !!maritalStatusId,
  })

  const createMutation = () => useMutation({
    mutationFn: createMaritalStatus,
    onSuccess: (res, body) => {
      client.setQueryData(maritalStatusKeys.detail(res.data.id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: maritalStatusKeys.list() }),
  })

  const editMutation = () => useMutation({
    mutationFn: editMaritalStatus,
    onSuccess: async (res, { body, id }) => {
      client.setQueryData(maritalStatusKeys.detail(id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: async () => client.invalidateQueries({ queryKey: maritalStatusKeys.list() }),
  })

  const deleteQuery = () => useMutation({
    mutationFn: deleteMaritalStatus,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: maritalStatusKeys.list() }),
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
