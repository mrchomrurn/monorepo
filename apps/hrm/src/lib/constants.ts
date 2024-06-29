import type { AsyncComponentLoader } from 'vue'

export interface FilterOptions {
  search?: string
  page: number
  size: number
}

export const defaultListFilter: FilterOptions = { page: 0, size: 50, search: '' }

export const formComponent: { [key: string]: AsyncComponentLoader } = {
  'bank': () => import('@/pages/setting/organization/bank/BankForm.vue'),
  'branch': () => import('@/pages/setting/organization/branch/BranchForm.vue'),
  'department': () => import('@/pages/setting/organization/department/DepartmentForm.vue'),
  'employee-category': () => import('@/pages/setting/employee/category/EmployeeCategoryForm.vue'),
  'employee-status': () => import('@/pages/setting/employee/status/EmployeeStatusForm.vue'),
  'employee-type': () => import('@/pages/setting/employee/type/EmployeeTypeForm.vue'),
  'employee-position': () => import('@/pages/setting/employee/position/EmployeePositionForm.vue'),
  'employee-grade': () => import('@/pages/setting/employee/grade/EmployeeGradeForm.vue'),
  'language': () => import('@/pages/setting/employee/language/LanguageForm.vue'),
  'social-media-contact': () => import('@/pages/setting/employee/social-media-contact/SocialMediaContactForm.vue'),
  'holidays': () => import('@/pages/setting/attendance/holiday/HolidayForm.vue'),
  'payroll-setting': () => import('@/pages/setting/payroll/payroll-setting/PayrollSettingForm.vue'),
  'allowance': () => import('@/pages/setting/payroll/allowance-type/AllowanceTypeForm.vue'),
  'leave-type': () => import('@/pages/setting/leave/leave-type/LeaveTypeForm.vue'),
  'work-shift': () => import('@/pages/setting/attendance/work-shift/WorkShiftForm.vue'),
  'employee-race': () => import('@/pages/setting/employee/race/EmployeeRaceForm.vue'),
  'employee-nationality': () => import('@/pages/setting/employee/nationality/EmployeeNationalityForm.vue'),
  'contract-type': () => import('@/pages/setting/employee/contract-type/ContractTypeForm.vue'),
  'marital-status': () => import('@/pages/setting/employee/marital-status/MaritalStatusForm.vue'),
  'leave': () => import('@/pages/leave-management/leave/LeaveForm.vue'),
} as const
