import type { RouteRecordRaw } from 'vue-router'

const branchRoutes: RouteRecordRaw = {
  path: 'branch',
  name: 'branch',
  meta: {
    menuId: 'HRM_SETTING',
    moduleName: 'branch',
    title: 'Branch',
  },
  children: [
    {
      path: '',
      name: 'branch-list',
      component: () => import('@/pages/setting/organization/branch/Branch.vue'),
    },
    {
      path: 'create',
      name: 'branch-create',
      component: () => import('@/pages/setting/organization/branch/BranchCreate.vue'),
      meta: {
        title: 'Create Branch',
      },
    },
  ],
}

const departmentRoutes: RouteRecordRaw = {
  path: 'department',
  name: 'department',
  meta: {
    menuId: 'HRM_SETTING',
    moduleName: 'department',
    title: 'Department',
  },
  children: [
    {
      path: '',
      name: 'department-list',
      component: () => import('@/pages/setting/organization/department/Department.vue'),
    },
    {
      path: 'create',
      name: 'department-create',
      component: () => import('@/pages/setting/organization/department/DepartmentCreate.vue'),
      meta: {
        title: 'Create Department',
      },
    },
  ],
}

const bankRoutes: RouteRecordRaw = {
  path: 'bank',
  name: 'bank',
  meta: {
    menuId: 'HRM_SETTING',
    moduleName: 'bank',
    title: 'Bank',
  },
  children: [
    {
      path: '',
      name: 'bank-list',
      component: () => import('@/pages/setting/organization/bank/Bank.vue'),
    },
    {
      path: 'create',
      name: 'bank-create',
      component: () => import('@/pages/setting/organization/bank/BankCreate.vue'),
      meta: {
        title: 'Create Bank',
      },
    },
  ],
}

export const organizationRoutes: Array<RouteRecordRaw> = [
  bankRoutes,
  branchRoutes,
  departmentRoutes,
]
