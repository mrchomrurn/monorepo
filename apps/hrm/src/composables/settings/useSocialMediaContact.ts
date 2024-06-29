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
  smcName: z.string().min(1, 'Required').describe('Name'),
  smcDes: z.string().describe('Description').nullish(),
})

export type SocialMediaContactSchema = z.infer<typeof schema>

export interface SocialMediaContact {
  smcId: string
  smcName: string
  smcDes?: string
}

interface Edit { body: SocialMediaContactSchema, id: string }

const fetchSocialMediaContact = async (options?: FilterOptions) => {
  const { data: result } = await api.post<ListResponse<SocialMediaContact>>('/api/smc/filter', options || {})
  return result.data
}

const fetchSocialMediaContactById = async (smcId: string) => {
  const { data: result } = await api.post<DetailResponse<SocialMediaContact>>(`/api/smc/id/${smcId}`)
  return result.data
}

const createSocialMediaContact = async (body: SocialMediaContactSchema) => {
  const { data } = await api.post<CreateResponse>('/api/smc/save', body)
  return data
}

const editSocialMediaContact = async ({ body, id }: Edit) => {
  const { data } = await api.post<MessageResponse>(`/api/smc/save/${id}`, body)
  return data
}

const deleteSocialMediaContact = async (smcId: string) => {
  const { data } = await api.post<MessageResponse>(`/api/smc/delete/${smcId}`)
  return data
}

const smcKeys = {
  list: () => ['smc-list'] as const,
  filter: (filters?: Ref<FilterOptions>) => [...smcKeys.list(), filters] as const,
  detail: (id: string) => ['smc-detail', id] as const,
}

export const useSocialMediaContact = () => {
  const { toast } = useToast()
  const client = useQueryClient()
  const fileComposable = useFile({ apiName: 'category', queryKey: smcKeys.list() })

  const listQuery = (options?: Ref<FilterOptions>) => {
    const filterKeys = computed(() => ({ ...defaultListFilter, ...options?.value }))
    return useQuery({
      queryKey: smcKeys.filter(filterKeys),
      queryFn: () => fetchSocialMediaContact(filterKeys.value),
    })
  }

  const getByIdQuery = (smcId: string) => useQuery({
    queryKey: smcKeys.detail(smcId),
    queryFn: () => fetchSocialMediaContactById(smcId),
    enabled: !!smcId,
  })

  const createMutation = () => useMutation({
    mutationFn: createSocialMediaContact,
    onSuccess: (res, body) => {
      client.setQueryData(smcKeys.detail(res.data.id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: smcKeys.list() }),
  })

  const editMutation = () => useMutation({
    mutationFn: editSocialMediaContact,
    onSuccess: async (res, { body, id }) => {
      client.setQueryData(smcKeys.detail(id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: async () => client.invalidateQueries({ queryKey: smcKeys.list() }),
  })

  const deleteQuery = () => useMutation({
    mutationFn: deleteSocialMediaContact,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: smcKeys.list() }),
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
