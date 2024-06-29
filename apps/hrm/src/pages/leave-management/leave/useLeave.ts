import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { capitalize } from 'lodash-es'
import type { ComputedRef, Ref } from 'vue'
import { z } from 'zod'
import { format, parse } from 'date-fns'

import { useToast } from '@/components/ui/toast'
import type { FilterOptions } from '@/lib/constants'
import { api } from '@/services/api'
import type { CreateResponse, DetailResponse, ListResponse, MessageResponse } from '@/types/ApiResponse'
import type { FileAttachment } from '@/composables/useFileUpload'

export const schema = z.object({
  leEmpId: z.string().min(1, 'Required'),
  leReason: z.string().min(1, 'Required'),
  leDescription: z.string().nullish().transform(v => v?.toUpperCase()),
  leAttachments: z.array(z.object({ fileName: z.string(), cdn: z.string() })).optional(),
  leaveDetails: z.array(z.object({
    ledId: z.string().nullish(),
    ledStartDate: z.string(),
    ledEndDate: z.string(),
    ledStartTime: z.date().nullish(),
    ledEndTime: z.date().nullish(),
    ledTypeId: z.string(),
  })),
})

export type LeaveSchema = z.infer<typeof schema>

export enum Status {
  All = 'All',
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled',
}

export interface Leave {
  leId: string
  leReason: string
  leDescription: string
  leCreatedDate: string
  leStatus: string
  leEmpId: string
  leEmpName: string
  leEmpNameKh: string
  leaveDetails: LeaveDetail[]
  leAttachments: FileAttachment[]
  canEdit: boolean
  canCancel: boolean
  viewAuth: boolean
}

export interface LeaveDetail {
  ledId: string
  ledStartDate: string
  ledEndDate: string
  ledStartTime: string
  ledEndTime: string
  ledTypeId: string
  ledTypeName: string
}

export interface LeaveList {
  leId: string
  leCreatedDate: string
  leEmpId: string
  leEmpName: string
  leEmpNameKh: string
  leReason: string
  leStatus: string
  canCancel: boolean
  canEdit: boolean
  viewAuth: boolean
}

export interface LeaveMaster {
  ltId: string
  ltName: string
}

export type LeaveFilter = FilterOptions & {
  status: Status
  startDate: string
  endDate: string
}

const fetchLeave = async (filters: LeaveFilter) => {
  const { data: result } = await api.post<ListResponse<LeaveList>>('/api/leave/filter', filters || {})
  return result.data
}

const fetchLeaveById = async (holidayId: string) => {
  const { data: result } = await api.post<DetailResponse<Leave>>(`/api/leave/id/${holidayId}`)
  return {
    ...result.data,
    leaveDetails: result.data.leaveDetails.map(detail => ({
      ...detail,
      ledStartTime: detail.ledStartTime ? parse(detail.ledStartTime, 'HH:mm:ss', new Date()) : null,
      ledEndTime: detail.ledEndTime ? parse(detail.ledEndTime, 'HH:mm:ss', new Date()) : null,
    })),
  }
}

const fetchLeaveMasterById = async (employeeId: string) => {
  const { data: result } = await api.post<DetailResponse<LeaveMaster[]>>(`/api/leave/master/${employeeId}`)
  return result.data
}

function transformLeaveFormBody(body: LeaveSchema) {
  return {
    ...body,
    leAttachments: body.leAttachments?.map(attachment => attachment.fileName),
    leaveDetails: body.leaveDetails.map(detail => ({
      ...detail,
      ledStartTime: detail.ledStartTime ? format(detail.ledStartTime, 'HH:mm:ss') : null,
      ledEndTime: detail.ledEndTime ? format(detail.ledEndTime, 'HH:mm:ss') : null,
    })),
  }
}

const createLeave = async (body: LeaveSchema) => {
  for (const detail of body.leaveDetails) {
    if (detail.ledId) delete detail.ledId
  }

  const { data } = await api.post<CreateResponse>('/api/leave/save', transformLeaveFormBody(body))
  return data
}

const editLeave = async ({ body, id }: { body: LeaveSchema, id: string }) => {
  const { data } = await api.post<MessageResponse>(`/api/leave/save/${id}`, transformLeaveFormBody(body))
  return data
}

const cancelLeave = async (id: string) => {
  const { data } = await api.post<MessageResponse>(`/api/leave/cancel/${id}`)
  return data
}

const leaveKeys = {
  list: () => ['leave-list'] as const,
  filter: (filters?: Ref<LeaveFilter>) => [...leaveKeys.list(), filters] as const,
  detail: (id: string) => ['leave-detail', id] as const,
}

export const useLeave = () => {
  const client = useQueryClient()
  const { toast } = useToast()

  const listQuery = (options: Ref<LeaveFilter>) => {
    return useQuery({
      queryKey: leaveKeys.filter(options),
      queryFn: () => fetchLeave(options.value),
    })
  }

  const getByIdQuery = (holidayId: string) => useQuery({
    queryKey: leaveKeys.detail(holidayId),
    queryFn: () => fetchLeaveById(holidayId),
    enabled: !!holidayId,
  })

  const getLeaveMasterByIdQuery = (employeeId: ComputedRef<string>) => useQuery({
    queryKey: ['leave-master', employeeId],
    queryFn: () => fetchLeaveMasterById(employeeId.value),
    enabled: () => !!employeeId.value,
  })

  const createMutation = () => useMutation({
    mutationFn: createLeave,
    onSuccess: (res, data) => {
      client.setQueryData(leaveKeys.detail(res.data.id), { ...data, phId: res?.data.id })
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: leaveKeys.list() })
    },
  })

  const editMutation = () => useMutation({
    mutationFn: editLeave,
    onSuccess: (res, { body, id }) => {
      client.setQueryData(leaveKeys.detail(id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: leaveKeys.list() }),
  })

  const cancelLeaveMutation = () => useMutation({
    mutationFn: cancelLeave,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: leaveKeys.list() }),
  })

  return {
    listQuery,
    getByIdQuery,
    getLeaveMasterByIdQuery,
    createMutation,
    editMutation,
    cancelLeaveMutation,
  }
}
