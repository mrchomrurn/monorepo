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
  branchName: z.string().min(1, 'Required').describe('Branch Name'),
  branchDes: z.string().describe('Branch Description').nullish(),
})

export type BranchSchema = z.infer<typeof schema>

export interface Branch {
  branchId: string
  branchName: string
  branchDes?: string
}

interface Edit { body: BranchSchema, id: string }

const fetchBranch = async (options?: FilterOptions) => {
  const { data: result } = await api.post<ListResponse<Branch>>('/api/branch/filter', options || {})
  return result.data
}

const fetchBranchById = async (branchId: string) => {
  const { data: result } = await api.post<DetailResponse<Branch>>(`/api/branch/id/${branchId}`)
  return result.data
}

const createBranch = async (body: BranchSchema) => {
  const { data } = await api.post<CreateResponse>('/api/branch/save', body)
  return data
}

const editBranch = async ({ body, id }: Edit) => {
  const { data } = await api.post<MessageResponse>(`/api/branch/save/${id}`, body)
  return data
}

const deleteBranch = async (branchId: string) => {
  const { data } = await api.post<MessageResponse>(`/api/branch/delete/${branchId}`)
  return data
}

const branchKeys = {
  list: () => ['branch-list'] as const,
  filter: (filters?: Ref<FilterOptions>) => [...branchKeys.list(), filters] as const,
  detail: (id: string) => ['branch-detail', id] as const,
}

export const branchesOptions = (options?: Ref<FilterOptions>) => {
  const filterKeys = computed(() => ({ ...defaultListFilter, ...options?.value }))
  return queryOptions({
    queryKey: branchKeys.filter(filterKeys),
    queryFn: () => fetchBranch(filterKeys.value),
  })
}

export const useBranch = () => {
  const { toast } = useToast()
  const client = useQueryClient()
  const fileComposable = useFile({ apiName: 'branch', queryKey: branchKeys.list() })

  const listQuery = (options?: Ref<FilterOptions>) => {
    return useQuery(branchesOptions(options))
  }

  const getByIdQuery = (branchId: string) => useQuery({
    queryKey: branchKeys.detail(branchId),
    queryFn: () => fetchBranchById(branchId),
    enabled: !!branchId,
  })

  const createMutation = () => useMutation({
    mutationFn: createBranch,
    onSuccess: (res, body) => {
      client.setQueryData(branchKeys.detail(res.data.id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: branchKeys.list() }),
  })

  const editMutation = () => useMutation({
    mutationFn: editBranch,
    onSuccess: async (res, { body, id }) => {
      client.setQueryData(branchKeys.detail(id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: async () => client.invalidateQueries({ queryKey: branchKeys.list() }),
  })

  const deleteQuery = () => useMutation({
    mutationFn: deleteBranch,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: branchKeys.list() }),
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
