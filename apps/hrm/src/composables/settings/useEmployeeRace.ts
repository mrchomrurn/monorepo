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
  raceName: z.string().min(1, 'Required').describe('Race Name'),
  raceDes: z.string().describe('Race Description').nullish(),
})

export type EmployeeRaceSchema = z.infer<typeof schema>
export type EmployeeRace = EmployeeRaceSchema & { raceId: string }

interface Edit { body: EmployeeRaceSchema, id: string }

const fetchEmployeeRace = async (options?: FilterOptions) => {
  const { data: result } = await api.post<ListResponse<EmployeeRace>>('/api/race/filter', options || {})
  return result.data
}

const fetchEmployeeRaceById = async (raceId: string) => {
  const { data: result } = await api.post<DetailResponse<EmployeeRace>>(`/api/race/id/${raceId}`)
  return result.data
}

const createEmployeeRace = async (body: EmployeeRaceSchema) => {
  const { data } = await api.post<CreateResponse>('/api/race/save', body)
  return data
}

const editEmployeeRace = async ({ body, id }: Edit) => {
  const { data } = await api.post<MessageResponse>(`/api/race/save/${id}`, body)
  return data
}

const deleteEmployeeRace = async (raceId: string) => {
  const { data } = await api.post<MessageResponse>(`/api/race/delete/${raceId}`)
  return data
}

const employeeRaceKeys = {
  list: () => ['employee-race-list'] as const,
  filter: (filters?: Ref<FilterOptions>) => [...employeeRaceKeys.list(), filters] as const,
  detail: (id: string) => ['employee-race-detail', id] as const,
}

export const employeeRaceOptions = (options?: Ref<FilterOptions>) => {
  const filterKeys = computed(() => ({ ...defaultListFilter, ...options?.value }))
  return queryOptions({
    queryKey: employeeRaceKeys.filter(filterKeys),
    queryFn: () => fetchEmployeeRace(filterKeys.value),
  })
}

export const useEmployeeRace = () => {
  const { toast } = useToast()
  const client = useQueryClient()
  const fileComposable = useFile({ apiName: 'race', queryKey: employeeRaceKeys.list() })

  const listQuery = (options?: Ref<FilterOptions>) => {
    return useQuery(employeeRaceOptions(options))
  }

  const getByIdQuery = (raceId: string) => useQuery({
    queryKey: employeeRaceKeys.detail(raceId),
    queryFn: () => fetchEmployeeRaceById(raceId),
    enabled: !!raceId,
  })

  const createMutation = () => useMutation({
    mutationFn: createEmployeeRace,
    onSuccess: (res, body) => {
      client.setQueryData(employeeRaceKeys.detail(res.data.id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: employeeRaceKeys.list() }),
  })

  const editMutation = () => useMutation({
    mutationFn: editEmployeeRace,
    onSuccess: async (res, { body, id }) => {
      client.setQueryData(employeeRaceKeys.detail(id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: async () => client.invalidateQueries({ queryKey: employeeRaceKeys.list() }),
  })

  const deleteQuery = () => useMutation({
    mutationFn: deleteEmployeeRace,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: employeeRaceKeys.list() }),
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
