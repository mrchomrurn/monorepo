import type { RouteRecordRaw } from 'vue-router'

const publicHolidayRoutes: RouteRecordRaw = {
  path: 'holidays',
  name: 'holidays',
  meta: {
    menuId: 'HRM_SETTING',
    moduleName: 'holidays',
    title: 'Holidays',
  },
  children: [
    {
      path: '',
      name: 'holidays-list',
      component: () => import('@/pages/setting/attendance/holiday/Holiday.vue'),
    },
    {
      path: 'create',
      name: 'holidays-create',
      component: () => import('@/pages/setting/attendance/holiday/HolidayCreate.vue'),
      meta: {
        title: 'Create Holidays',
      },
    },
  ],
}

const workShiftRoutes: RouteRecordRaw = {
  path: 'work-shift',
  name: 'work-shift',
  meta: {
    menuId: 'HRM_SETTING',
    moduleName: 'work-shift',
    title: 'Work Shift',
  },
  children: [
    {
      path: '',
      name: 'work-shift-list',
      component: () => import('@/pages/setting/attendance/work-shift/WorkShift.vue'),
    },
    {
      path: 'create',
      name: 'work-shift-create',
      component: () => import('@/pages/setting/attendance/work-shift/WorkShiftCreate.vue'),
      meta: {
        title: 'Create Work Shift',
      },
    },
  ],
}

export const attendanceRoutes: Array<RouteRecordRaw> = [
  publicHolidayRoutes,
  workShiftRoutes,
]
