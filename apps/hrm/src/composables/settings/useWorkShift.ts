import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { capitalize } from 'lodash-es'
import { type Ref, computed } from 'vue'
import { z } from 'zod'

import { useFile } from '../useFile'
import { useToast } from '@/components/ui/toast'
import { type FilterOptions, defaultListFilter } from '@/lib/constants'
import { api } from '@/services/api'
import type { CreateResponse, DetailResponse, ListResponse, MessageResponse } from '@/types/ApiResponse'
import { AssignmentTypes } from '@/composables/useAssignmentType'

enum WeekDays {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
  Sunday = 'sunday',
}

export const schema = z.object({
  wsName: z.string().min(1, 'Required').describe('Name'),
  assignment: z.object({
    asmType: z.nativeEnum(AssignmentTypes).describe('Assignment Type'),
    details: z.array(z.string()).min(1, 'Required'),
  }),
  listDetail: z.array(z.object({
    wsdId: z.string().nullish().describe('wsdId'),
    wsdWeekDay: z.nativeEnum(WeekDays).describe('Week Day'),
    wsdDuration: z.number().positive().describe('Duration'),

    wsdIn1: z.string().describe('Time In 1'),
    wsdStartCheckIn1: z.string().describe('Start Check In 1'),
    wsdEndCheckIn1: z.string().describe('End Check In 1'),
    wsdMaxLatePeriodIn1: z.string().describe('Max Late Period In 1'),

    wsdOut1: z.string().describe('Time Out 1'),
    wsdStartCheckOut1: z.string().describe('Start Check Out 1'),
    wsdEndCheckOut1: z.string().describe('End Check Out 1'),
    wsdMaxEarlyPeriodOut1: z.string().describe('Max Early Period Out 1'),

    wsdIn2: z.string().describe('Time In 2').nullish(),
    wsdStartCheckIn2: z.string().describe('Start Check In 2').nullish(),
    wsdEndCheckIn2: z.string().describe('End Check In 2').nullish(),
    wsdMaxLatePeriodIn2: z.string().describe('Max Late Period In 2').nullish(),

    wsdOut2: z.string().describe('Time Out 2').nullish(),
    wsdStartCheckOut2: z.string().describe('Start Check Out 2').nullish(),
    wsdEndCheckOut2: z.string().describe('End Check Out 2').nullish(),
    wsdMaxEarlyPeriodOut2: z.string().describe('Max Early Period Out 2').nullish(),
  })).min(1, 'Required'),
  wsDes: z.string().describe('Description').nullish(),
})

export type WorkShiftSchema = z.infer<typeof schema>

export interface WorkShift {
  wsId: string
  wsName: string
}

const fetchWorkShift = async (filters: FilterOptions) => {
  const { data: result } = await api.post<ListResponse<WorkShift>>('/api/work-shift/filter', filters || {})
  return result.data
}

const fetchWorkShiftById = async (holidayId: string) => {
  const { data: result } = await api.post<DetailResponse<WorkShiftSchema>>(`/api/work-shift/id/${holidayId}`)
  return result.data
}

const createWorkShift = async (body: WorkShiftSchema) => {
  const { data } = await api.post<CreateResponse>('/api/work-shift/save', body)
  return data
}

const editWorkShift = async ({ body, id }: { body: WorkShiftSchema, id: string }) => {
  const { data } = await api.post<MessageResponse>(`/api/work-shift/save/${id}`, body)
  return data
}

const deleteWorkShift = async (holidayId: string) => {
  const { data } = await api.post<MessageResponse>(`/api/work-shift/delete/${holidayId}`)
  return data
}

const workShiftKeys = {
  list: () => ['work-shift-list'] as const,
  filter: (filters?: Ref<FilterOptions>) => [...workShiftKeys.list(), filters] as const,
  detail: (id: string) => ['work-shift-detail', id] as const,
}

export const useWorkShift = () => {
  const client = useQueryClient()
  const { toast } = useToast()
  const fileComposable = useFile({ apiName: 'work-shift', queryKey: workShiftKeys.list() })

  const listQuery = (options?: Ref<FilterOptions>) => {
    const filterKeys = computed(() => ({ ...defaultListFilter, ...options?.value }))
    return useQuery({
      queryKey: workShiftKeys.filter(filterKeys),
      queryFn: () => fetchWorkShift(filterKeys.value),
    })
  }

  const getByIdQuery = (holidayId: string) => useQuery({
    queryKey: workShiftKeys.detail(holidayId),
    queryFn: () => fetchWorkShiftById(holidayId),
    enabled: !!holidayId,
  })

  const createMutation = () => useMutation({
    mutationFn: createWorkShift,
    onSuccess: (res, data) => {
      client.setQueryData(workShiftKeys.detail(res.data.id), { ...data, phId: res?.data.id })
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: workShiftKeys.list() })
    },
  })

  const editMutation = () => useMutation({
    mutationFn: editWorkShift,
    onSuccess: (res, { body, id }) => {
      client.setQueryData(workShiftKeys.detail(id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: workShiftKeys.list() }),
  })

  const deleteQuery = () => useMutation({
    mutationFn: deleteWorkShift,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: workShiftKeys.list() }),
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
