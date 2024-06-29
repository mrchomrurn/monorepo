import type { RouteRecordRaw } from 'vue-router'

const leaveTypeRoutes: RouteRecordRaw = {
  path: 'leave-type',
  name: 'leave-type',
  meta: {
    menuId: 'HRM_SETTING',
    moduleName: 'leave-type',
    title: 'Leave Type',
  },
  children: [
    {
      path: '',
      name: 'leave-type-list',
      component: () => import('@/pages/setting/leave/leave-type/LeaveType.vue'),
    },
    {
      path: 'create',
      name: 'leave-type-create',
      component: () => import('@/pages/setting/leave/leave-type/LeaveTypeCreate.vue'),
      meta: {
        title: 'Create Leave Type',
      },
    },
  ],
}

export const leaveSettingRoutes: Array<RouteRecordRaw> = [leaveTypeRoutes]
