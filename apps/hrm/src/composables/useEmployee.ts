import { queryOptions, useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type { FilterOptions } from '@/lib/constants'
import { api } from '@/services/api'
import type { ListResponse } from '@/types/ApiResponse'

export interface Employee {
  empId: string
  empName: string
  empNameKh: string
  empBranchId: string
  empBranchName: string
  empDepartmentId: string
  empDepartmentName: string
  empPositionId: string
  empPositionName: string
  profileImg: string
  signatureImg: string
}

const fetchEmployees = async (filters: FilterOptions) => {
  return api.post<ListResponse<Employee>>('/api/employee/filter-master', filters)
}

export const getEmployeesQueryOptions = (filters: Ref<FilterOptions>) => {
  return queryOptions({
    queryKey: ['employee-list', filters],
    queryFn: () => fetchEmployees(filters.value),
    select: ({ data: res }) => res.data,
  })
}

export const useEmployees = (filters: Ref<FilterOptions>) => {
  return useQuery(getEmployeesQueryOptions(filters))
}
