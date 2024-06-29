import type { RouteRecordRaw } from 'vue-router'
import { organizationRoutes } from './organizationRoutes'
import { employeeRoutes } from './employeeRoutes'
import { attendanceRoutes } from './attendanceRoutes'
import { payrollRoutes } from '@/router/setting/payrollRoutes'
import { leaveSettingRoutes } from '@/router/setting/leaveRoutes'

export const settingRoutes: Array<RouteRecordRaw> = [
  ...organizationRoutes,
  ...employeeRoutes,
  ...attendanceRoutes,
  ...payrollRoutes,
  ...leaveSettingRoutes,
]
