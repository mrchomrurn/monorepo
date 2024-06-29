import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { capitalize } from 'lodash-es'
import { type Ref, computed } from 'vue'
import { z } from 'zod'

import { useToast } from '@/components/ui/toast'
import { type FilterOptions, defaultListFilter } from '@/lib/constants'
import { api } from '@/services/api'
import type { CreateResponse, DetailResponse, ListResponse, MessageResponse } from '@/types/ApiResponse'
import { useFile } from '@/composables/useFile'

export const schema = z.object({
  psName: z.string().describe('Name').min(1, 'Required'),
  psType: z.enum(['Weekly', 'Semimonthly', 'Monthly']).describe('Type'),
  psNumOfWorkingDays: z.number({ invalid_type_error: 'Required' })
    .describe('Number of Working Days')
    .positive(),
  psNumOfWorkingHoursPerDay: z.number({ invalid_type_error: 'Required' })
    .describe('Number of Working Hours Per Day')
    .positive(),
  psFirstCutOffDay: z.number({ invalid_type_error: 'Required' })
    .describe('First Cut Off Day')
    .int()
    .positive(),
  psSecondCutOffDay: z.number({ invalid_type_error: 'Required' })
    .describe('Second Cut Off Day')
    .int()
    .positive()
    .nullish(),
  psDes: z.string().describe('Description').nullish(),
}).refine(data => data.psType === 'Semimonthly' ? data.psSecondCutOffDay : true, { message: 'Required', path: ['psSecondCutOffDay'] })

export type PayrollSchema = z.infer<typeof schema>

export interface Payroll {
  psId: string
  psName: string
}

const fetchPayroll = async (filters?: FilterOptions) => {
  const { data: result } = await api.post<ListResponse<Payroll>>('/api/payroll-setting/filter', filters || {})
  return result.data
}

const fetchPayrollById = async (payrollId: string) => {
  const { data: result } = await api.post<DetailResponse<Payroll>>(`/api/payroll-setting/id/${payrollId}`)
  return result.data
}

const createPayroll = async (body: PayrollSchema) => {
  const { data } = await api.post<CreateResponse>('/api/payroll-setting/save', body)
  return data
}

const editPayroll = async ({ body, id }: { body: PayrollSchema, id: string }) => {
  const { data } = await api.post<MessageResponse>(`/api/payroll-setting/save/${id}`, body)
  return data
}

const deletePayroll = async (payrollId: string) => {
  const { data } = await api.post<MessageResponse>(`/api/payroll-setting/delete/${payrollId}`)
  return data
}

const payrollKeys = {
  list: () => ['payroll-list'] as const,
  filter: (filters?: Ref<FilterOptions>) => [...payrollKeys.list(), filters] as const,
  detail: (id: string) => ['payroll-detail', id] as const,
}

export const usePayroll = () => {
  const client = useQueryClient()
  const { toast } = useToast()
  const fileComposable = useFile({ apiName: 'payroll-setting', queryKey: payrollKeys.list() })

  const listQuery = (options?: Ref<FilterOptions>) => {
    const filterKeys = computed(() => ({ ...defaultListFilter, ...options?.value }))
    return useQuery({
      queryKey: payrollKeys.filter(filterKeys),
      queryFn: ({ queryKey }) => fetchPayroll(queryKey[1]),
    })
  }

  const getByIdQuery = (payrollId: string) => useQuery({
    queryKey: payrollKeys.detail(payrollId),
    queryFn: () => fetchPayrollById(payrollId),
    enabled: !!payrollId,
  })

  const createMutation = () => useMutation({
    mutationFn: createPayroll,
    onSuccess: (res, data) => {
      client.setQueryData(payrollKeys.detail(res.data.id), { ...data, phId: res?.data.id })
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: payrollKeys.list() })
    },
  })

  const editMutation = () => useMutation({
    mutationFn: editPayroll,
    onSuccess: (res, { body, id }) => {
      client.setQueryData(payrollKeys.detail(id), body)
      toast({ title: capitalize(res.message), description: res.msg })
    },
    onSettled: () => client.invalidateQueries({ queryKey: payrollKeys.list() }),
  })

  const deleteQuery = () => useMutation({
    mutationFn: deletePayroll,
    onSuccess: res => toast({ title: capitalize(res.message), description: res.msg }),
    onSettled: () => client.invalidateQueries({ queryKey: payrollKeys.list() }),
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
