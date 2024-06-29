import type { RouteRecordRaw } from 'vue-router'

const payrollSettingRoutes: RouteRecordRaw = {
  path: 'payroll-setting',
  name: 'payroll-setting',
  meta: {
    menuId: 'HRM_SETTING',
    moduleName: 'payroll-setting',
    title: 'Payroll Setting',
  },
  children: [
    {
      path: '',
      name: 'payroll-setting-list',
      component: () => import('@/pages/setting/payroll/payroll-setting/PayrollSetting.vue'),
    },
    {
      path: 'create',
      name: 'payroll-setting-create',
      component: () => import('@/pages/setting/payroll/payroll-setting/PayrollSettingCreate.vue'),
      meta: {
        title: 'Create Payroll Setting',
      },
    },
  ],
}

const allowanceTypeRoutes: RouteRecordRaw = {
  path: 'allowance',
  name: 'allowance',
  meta: {
    menuId: 'HRM_SETTING',
    moduleName: 'allowance',
    title: 'Allowance Type',
  },
  children: [
    {
      path: '',
      name: 'allowance-list',
      component: () => import('@/pages/setting/payroll/allowance-type/AllowanceType.vue'),
    },
    {
      path: 'create',
      name: 'allowance-create',
      component: () => import('@/pages/setting/payroll/allowance-type/AllowanceTypeCreate.vue'),
      meta: {
        title: 'Create Allowance Type',
      },
    },
  ],
}

export const payrollRoutes: Array<RouteRecordRaw> = [
  payrollSettingRoutes,
  allowanceTypeRoutes,
]
