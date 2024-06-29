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
  bankName: z.string().min(1, 'Required').describe('Bank Name'),
  bankDes: z.string().describe('Bank Description').nullish(),
})

export type BankSchema = z.infer<typeof schema>

export interface Bank {
  bankId: string
  bankName: string
  bankDes?: string
}

interface Edit { body: BankSchema, id: string }

const fetchBank = async (options?: FilterOptions) => {
  const { data: result } = await api.post<ListResponse<Bank>>('/api/bank/filter', options || {})
  return result.data
}

const fetchBankById = async (bankId: string) => {
  const { data: result } = await api.post<DetailResponse<Bank>>(`/api/bank/id/${bankId}`)
  return result.data
}

const createBank = async (body: BankSchema) => {
  const { data } = await api.post<CreateResponse>('/api/bank/save', body)
  return data
}

const editBank = async ({ body, id }: Edit) => {
  const { data } = await api.post<MessageResponse>(`/api/bank/save/${id}`, body)
  return data
}

const deleteBank = async (bankId: string) => {
  const { data } = await api.post<MessageResponse>(`/api/bank/delete/${bankId}`)
  return data
}

const bankKeys = {
  list: () => ['bank-list'] as const,
  filter: (filters?: Ref<FilterOptions>) => [...bankKeys.list(), filters] as const,
  detail: (id: string) => ['bank-detail', id] as const,
}

export const useBank = () => {
  const { toast } = useToast()
  const client = useQueryClient()
  const fileComposable = useFile({ apiName: 'bank', queryKey: bankKeys.list() })

  const listQuery = (options?: Ref<FilterOptions>) => {
    const filterKeys = computed(() => ({ ...defaultListFilter, ...options?.value }))
    return useQuery({
      queryKey: bankKeys.filter(filterKeys),
      queryFn: () => fetchBank(filterKeys.value),
    })
  }

  const getByIdQuery = (bankId: string) => useQuery({
    queryKey: bankKeys.detail(bankId),
    queryFn: () => fetchBankById(bankId),
    enabled: !!bankId,
  })

  const createMutation = () => useMutation({
    mutationFn: createBank,
    onSuccess: (res, body) => {
      client.setQueryData(bankKeys.detail(res.data.id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: bankKeys.list() }),
  })

  const editMutation = () => useMutation({
    mutationFn: editBank,
    onSuccess: async (res, { body, id }) => {
      client.setQueryData(bankKeys.detail(id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: async () => client.invalidateQueries({ queryKey: bankKeys.list() }),
  })

  const deleteQuery = () => useMutation({
    mutationFn: deleteBank,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: bankKeys.list() }),
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
