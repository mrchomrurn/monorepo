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
  ltName: z.string().describe('Name').min(1, 'Required'),
  ltTermType: z.enum(['Month', 'Week', 'Day']).describe('Term Type'),
  ltTerm: z.number({ invalid_type_error: 'Required' }).positive().describe('Term'),
  ltGenderRestriction: z.enum(['All', 'Male', 'Female']).describe('Gender Restriction'),
  ltEffectiveDate: z.string().describe('Effective Date'),
  ltDeductionType: z.enum(['Pro-rate', 'Percentage']).describe('Deduction Type'),
  ltDeductionValue: z.number({ invalid_type_error: 'Required' })
    .describe('Deduction Value')
    .positive(),
  ltDeductionMultiplier: z.number({ invalid_type_error: 'Required' })
    .describe('Deduction Multiplier')
    .positive(),
  assignment: z.object({
    asmType: z.nativeEnum(AssignmentTypes).describe('Assignment Type'),
    details: z.array(z.string()).min(1, 'Required'),
  }),
  additionalTermByEmploymentLengths: z.array(z.object({
    fromYear: z.number({ invalid_type_error: 'Required' }).int().positive(),
    toYear: z.number({ invalid_type_error: 'Required' }).int().positive(),
    term: z.number({ invalid_type_error: 'Required' }).positive(),
  }, { invalid_type_error: 'Required' }).describe('Lengths')).optional(),
  ltDescription: z.string().describe('Description').nullish(),
})

export type LeaveTypeSchema = z.infer<typeof schema>
export type LeaveType = LeaveTypeSchema & { ltId: string }

export interface LeaveTypeList {
  ltId: string
  ltName: string
}

const fetchLeaveType = async (filters?: FilterOptions) => {
  const { data: result } = await api.post<ListResponse<LeaveTypeList>>('/api/leave-type/filter', filters || {})
  return result.data
}

const fetchLeaveTypeById = async (leaveTypeId: string) => {
  const { data: result } = await api.post<DetailResponse<LeaveType>>(`/api/leave-type/id/${leaveTypeId}`)
  return result.data
}

const createLeaveType = async (body: LeaveTypeSchema) => {
  const { data } = await api.post<CreateResponse>('/api/leave-type/save', body)
  return data
}

const editLeaveType = async ({ body, id }: { body: LeaveTypeSchema, id: string }) => {
  const { data } = await api.post<MessageResponse>(`/api/leave-type/save/${id}`, body)
  return data
}

const deleteLeaveType = async (leaveTypeId: string) => {
  const { data } = await api.post<MessageResponse>(`/api/leave-type/delete/${leaveTypeId}`)
  return data
}

const leaveTypeKeys = {
  list: () => ['leave-type-list'] as const,
  filter: (filters?: Ref<FilterOptions>) => [...leaveTypeKeys.list(), filters] as const,
  detail: (id: string) => ['leave-type-detail', id] as const,
}

export const useLeaveType = () => {
  const client = useQueryClient()
  const { toast } = useToast()
  const fileComposable = useFile({ apiName: 'leave-type', queryKey: leaveTypeKeys.list() })

  const listQuery = (options?: Ref<FilterOptions>) => {
    const filterKeys = computed(() => ({ ...defaultListFilter, ...options?.value }))
    return useQuery({
      queryKey: leaveTypeKeys.filter(filterKeys),
      queryFn: ({ queryKey }) => fetchLeaveType(queryKey[1]),
    })
  }

  const getByIdQuery = (leaveTypeId: string) => useQuery({
    queryKey: leaveTypeKeys.detail(leaveTypeId),
    queryFn: () => fetchLeaveTypeById(leaveTypeId),
    enabled: !!leaveTypeId,
  })

  const createMutation = () => useMutation({
    mutationFn: createLeaveType,
    onSuccess: (res, data) => {
      client.setQueryData(leaveTypeKeys.detail(res.data.id), { ...data, phId: res?.data.id })
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: leaveTypeKeys.list() })
    },
  })

  const editMutation = () => useMutation({
    mutationFn: editLeaveType,
    onSuccess: (res, { body, id }) => {
      client.setQueryData(leaveTypeKeys.detail(id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: leaveTypeKeys.list() }),
  })

  const deleteQuery = () => useMutation({
    mutationFn: deleteLeaveType,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: leaveTypeKeys.list() }),
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
