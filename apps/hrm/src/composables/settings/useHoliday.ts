import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { capitalize } from 'lodash-es'
import { type Ref, computed } from 'vue'
import { z } from 'zod'

import { useFile } from '../useFile'
import { useToast } from '@/components/ui/toast'
import { type FilterOptions, defaultListFilter } from '@/lib/constants'
import { api } from '@/services/api'
import type { CreateResponse, DetailResponse, ListResponse, MessageResponse } from '@/types/ApiResponse'
import type { FormField } from '@/types/Form'

export const schema = z.object({
  phName: z.string().min(1, 'Required').describe('Name'),
  phStartDate: z.string().describe('Start Date'),
  phEndDate: z.string().describe('End Date'),
  phDes: z.string().describe('Description').nullish(),
})

export type HolidaySchema = z.infer<typeof schema>
interface Edit { body: HolidaySchema, id: string }

export interface Holiday {
  phId: string
  phName: string
  phStartDate: string
  phEndDate: string
  phDes?: string
}

export const fields: Array<FormField> = [
  { label: 'Name', validateKey: 'phName', type: 'text' },
  { label: 'Start Date', validateKey: 'phStartDate', type: 'date' },
  { label: 'End Date', validateKey: 'phEndDate', type: 'date' },
  { label: 'Description', validateKey: 'phDes', type: 'textarea' },
]

const fetchHolidays = async (filters?: HolidayFilter) => {
  const { data: result } = await api.post<ListResponse<Holiday>>('/api/public-holiday/filter', filters || {})
  return result.data
}

const fetchHolidaysById = async (holidayId: string) => {
  const { data: result } = await api.post<DetailResponse<Holiday>>(`/api/public-holiday/id/${holidayId}`)
  return result.data
}

const createHolidays = async (body: HolidaySchema) => {
  const values = { ...body, phStartDate: body.phStartDate.toString(), phEndDate: body.phEndDate.toString() }
  const { data } = await api.post<CreateResponse>('/api/public-holiday/save', values)
  return data
}

const editHolidays = async ({ body, id }: Edit) => {
  const values = { ...body, phStartDate: body.phStartDate.toString(), phEndDate: body.phEndDate.toString() }
  const { data } = await api.post<MessageResponse>(`/api/public-holiday/save/${id}`, values)
  return data
}

const deleteHolidays = async (holidayId: string) => {
  const { data } = await api.post<MessageResponse>(`/api/public-holiday/delete/${holidayId}`)
  return data
}

export type HolidayFilter = FilterOptions & { startDate?: string | null, endDate?: string | null }

const defaultHolidayFilters: HolidayFilter = {
  ...defaultListFilter,
  startDate: null,
  endDate: null,
}

const holidayKeys = {
  list: () => ['holiday-list'] as const,
  filter: (filters?: Ref<HolidayFilter>) => [...holidayKeys.list(), filters] as const,
  detail: (id: string) => ['holiday-detail', id] as const,
}

export const useHoliday = () => {
  const client = useQueryClient()
  const { toast } = useToast()
  const fileComposable = useFile({ apiName: 'public-holiday', queryKey: holidayKeys.list() })

  const listQuery = (options?: Ref<HolidayFilter>) => {
    const filterKeys = computed(() => ({ ...defaultHolidayFilters, ...options?.value }))
    return useQuery({
      queryKey: holidayKeys.filter(filterKeys),
      queryFn: ({ queryKey }) => fetchHolidays(queryKey[1]),
    })
  }

  const getByIdQuery = (holidayId: string) => useQuery({
    queryKey: holidayKeys.detail(holidayId),
    queryFn: () => fetchHolidaysById(holidayId),
    enabled: !!holidayId,
  })

  const createMutation = () => useMutation({
    mutationFn: createHolidays,
    onSuccess: (res, data) => {
      client.setQueryData(holidayKeys.detail(res.data.id), { ...data, phId: res?.data.id })
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: holidayKeys.list() })
    },
  })

  const editMutation = () => useMutation({
    mutationFn: editHolidays,
    onSuccess: (res, { body, id }) => {
      client.setQueryData(holidayKeys.detail(id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: holidayKeys.list() }),
  })

  const deleteQuery = () => useMutation({
    mutationFn: deleteHolidays,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: holidayKeys.list() }),
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
