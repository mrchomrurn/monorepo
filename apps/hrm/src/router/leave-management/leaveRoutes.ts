import type { RouteRecordRaw } from 'vue-router'

const leaveRoutes: RouteRecordRaw = {
  path: 'leave',
  name: 'leave',
  meta: {
    menuId: 'HRM_LEAVE',
    moduleName: 'leave',
    title: 'Leave',
  },
  children: [
    {
      path: '',
      name: 'leave-list',
      component: () => import('@/pages/leave-management/leave/Leave.vue'),
    },
    {
      path: 'create',
      name: 'leave-create',
      component: () => import('@/pages/leave-management/leave/LeaveCreate.vue'),
      meta: {
        title: 'Create Leave',
      },
    },
  ],
}

export const leaveSettingRoutes: Array<RouteRecordRaw> = [leaveRoutes]
