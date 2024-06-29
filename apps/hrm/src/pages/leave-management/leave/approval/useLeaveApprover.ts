import { useQuery } from '@tanstack/vue-query'
import { api } from '@/services/api'
import type { DetailResponse } from '@/types/ApiResponse'

export interface Approver {
  empId: string
  empName: string
  empNameKh: string
  empGender: string
  empBranchId: string
  empBranchName: string
  empDepartmentId: string
  empDepartmentName: string
  empPositionId: string
  empPositionName: string
  profileImg: string
  profileImgUrl: any
  signatureImg: string
}

const fetchApproverById = async (approvalId: string) => {
  const { data: result } = await api.post<DetailResponse<Approver[]>>(`/api/auth/approver/${approvalId}`)

  return result.data
}

export const useLeaveApprover = (approvalId: string) => {
  return useQuery({
    queryKey: ['leave-approver', approvalId],
    queryFn: () => fetchApproverById(approvalId),
    enabled: !!approvalId,
  })
}
