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
  lanName: z.string().min(1, 'Required').describe('Name'),
  lanDes: z.string().describe('Description').nullish(),
})

export type LanguageSchema = z.infer<typeof schema>

export interface Language {
  lanId: string
  lanName: string
  lanDes?: string
}

interface Edit { body: LanguageSchema, id: string }

const fetchLanguage = async (options?: FilterOptions) => {
  const { data: result } = await api.post<ListResponse<Language>>('/api/language/filter', options || {})
  return result.data
}

const fetchLanguageById = async (lanId: string) => {
  const { data: result } = await api.post<DetailResponse<Language>>(`/api/language/id/${lanId}`)
  return result.data
}

const createLanguage = async (body: LanguageSchema) => {
  const { data } = await api.post<CreateResponse>('/api/language/save', body)
  return data
}

const editLanguage = async ({ body, id }: Edit) => {
  const { data } = await api.post<MessageResponse>(`/api/language/save/${id}`, body)
  return data
}

const deleteLanguage = async (lanId: string) => {
  const { data } = await api.post<MessageResponse>(`/api/language/delete/${lanId}`)
  return data
}

const languageKeys = {
  list: () => ['language-list'] as const,
  filter: (filters?: Ref<FilterOptions>) => [...languageKeys.list(), filters] as const,
  detail: (id: string) => ['language-detail', id] as const,
}

export const useLanguage = () => {
  const { toast } = useToast()
  const client = useQueryClient()
  const fileComposable = useFile({ apiName: 'language', queryKey: languageKeys.list() })

  const listQuery = (options?: Ref<FilterOptions>) => {
    const filterKeys = computed(() => ({ ...defaultListFilter, ...options?.value }))
    return useQuery({
      queryKey: languageKeys.filter(filterKeys),
      queryFn: () => fetchLanguage(filterKeys.value),
    })
  }

  const getByIdQuery = (lanId: string) => useQuery({
    queryKey: languageKeys.detail(lanId),
    queryFn: () => fetchLanguageById(lanId),
    enabled: !!lanId,
  })

  const createMutation = () => useMutation({
    mutationFn: createLanguage,
    onSuccess: (res, body) => {
      client.setQueryData(languageKeys.detail(res.data.id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: languageKeys.list() }),
  })

  const editMutation = () => useMutation({
    mutationFn: editLanguage,
    onSuccess: async (res, { body, id }) => {
      client.setQueryData(languageKeys.detail(id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: async () => client.invalidateQueries({ queryKey: languageKeys.list() }),
  })

  const deleteQuery = () => useMutation({
    mutationFn: deleteLanguage,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: languageKeys.list() }),
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
