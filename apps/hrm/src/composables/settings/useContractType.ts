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
  ctName: z.string().min(1, 'Required').describe('Contract Type Name'),
  ctDes: z.string().describe('Contract Type Description').nullish(),
})

export type ContractTypeSchema = z.infer<typeof schema>
export type ContractType = ContractTypeSchema & { ctId: string }

interface Edit { body: ContractTypeSchema, id: string }

const fetchContractType = async (options?: FilterOptions) => {
  const { data: result } = await api.post<ListResponse<ContractType>>('/api/contract-type/filter', options || {})
  return result.data
}

const fetchContractTypeById = async (contractId: string) => {
  const { data: result } = await api.post<DetailResponse<ContractType>>(`/api/contract-type/id/${contractId}`)
  return result.data
}

const createContractType = async (body: ContractTypeSchema) => {
  const { data } = await api.post<CreateResponse>('/api/contract-type/save', body)
  return data
}

const editContractType = async ({ body, id }: Edit) => {
  const { data } = await api.post<MessageResponse>(`/api/contract-type/save/${id}`, body)
  return data
}

const deleteContractType = async (contractId: string) => {
  const { data } = await api.post<MessageResponse>(`/api/contract-type/delete/${contractId}`)
  return data
}

const contractTypeKeys = {
  list: () => ['contract-type-list'] as const,
  filter: (filters?: Ref<FilterOptions>) => [...contractTypeKeys.list(), filters] as const,
  detail: (id: string) => ['contract-type-detail', id] as const,
}

export const contractTypeOptions = (options?: Ref<FilterOptions>) => {
  const filterKeys = computed(() => ({ ...defaultListFilter, ...options?.value }))
  return queryOptions({
    queryKey: contractTypeKeys.filter(filterKeys),
    queryFn: () => fetchContractType(filterKeys.value),
  })
}

export const useContractType = () => {
  const { toast } = useToast()
  const client = useQueryClient()
  const fileComposable = useFile({ apiName: 'contract-type', queryKey: contractTypeKeys.list() })

  const listQuery = (options?: Ref<FilterOptions>) => {
    return useQuery(contractTypeOptions(options))
  }

  const getByIdQuery = (contractId: string) => useQuery({
    queryKey: contractTypeKeys.detail(contractId),
    queryFn: () => fetchContractTypeById(contractId),
    enabled: !!contractId,
  })

  const createMutation = () => useMutation({
    mutationFn: createContractType,
    onSuccess: (res, body) => {
      client.setQueryData(contractTypeKeys.detail(res.data.id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: contractTypeKeys.list() }),
  })

  const editMutation = () => useMutation({
    mutationFn: editContractType,
    onSuccess: async (res, { body, id }) => {
      client.setQueryData(contractTypeKeys.detail(id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: async () => client.invalidateQueries({ queryKey: contractTypeKeys.list() }),
  })

  const deleteQuery = () => useMutation({
    mutationFn: deleteContractType,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: contractTypeKeys.list() }),
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
