import { useQuery } from '@tanstack/vue-query'
import { parse } from 'date-fns'
import { api } from '@/services/api'
import type { DetailResponse } from '@/types/ApiResponse'

export interface LeaveApproval {
  id: string
  name: string
  empId: string
  empName: string
  empNameKh: any
  empBranchId: string
  empBranchName: string
  empDepartmentId: string
  empDepartmentName: string
  empPositionId: string
  empPositionName: string
  status: 'approved' | 'pending' | 'rejected' | 'cancelled'
  actionDateTime: string | Date
  comment: string
  level: number
  profileImgUrl: string | null
}

const fetchLeaveApprovalById = async (leaveId: string = '') => {
  const { data: result } = await api.post<DetailResponse<LeaveApproval[]>>(`/api/leave/auth/${leaveId}`)

  return result.data.map(approval => ({
    ...approval,
    actionDateTime: approval.actionDateTime ? parse(approval.actionDateTime as string, 'yyyy-MM-dd HH:mm:ss', new Date()) : null,
  })) as LeaveApproval[]
}

export const useLeaveApproval = (leaveId?: string) => {
  return useQuery({
    queryKey: ['leave-approval', leaveId],
    queryFn: () => fetchLeaveApprovalById(leaveId),
    enabled: !!leaveId,
  })
}
