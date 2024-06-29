import type { RouteRecordRaw } from 'vue-router'

const employeeCategoryRoutes: RouteRecordRaw = {
  path: 'employee-category',
  name: 'employee-category',
  meta: {
    menuId: 'HRM_SETTING',
    moduleName: 'employee-category',
    title: 'Employee Category',
  },
  children: [
    {
      path: '',
      name: 'employee-category-list',
      component: () => import('@/pages/setting/employee/category/EmployeeCategory.vue'),
    },
    {
      path: 'create',
      name: 'employee-category-create',
      component: () => import('@/pages/setting/employee/category/EmployeeCategoryCreate.vue'),
      meta: {
        title: 'Create Employee Category',
      },
    },
  ],
}

const employeePositionRoutes: RouteRecordRaw
  = {
    path: 'employee-position',
    name: 'employee-position',
    meta: {
      menuId: 'HRM_SETTING',
      moduleName: 'employee-position',
      title: 'Employee Position',
    },
    children: [
      {
        path: '',
        name: 'employee-position-list',
        component: () => import('@/pages/setting/employee/position/EmployeePosition.vue'),
      },
      {
        path: 'create',
        name: 'employee-position-create',
        component: () => import('@/pages/setting/employee/position/EmployeePositionCreate.vue'),
        meta: {
          title: 'Create Employee Position',
        },
      },
    ],
  }

const employeeStatusRoutes: RouteRecordRaw = {
  path: 'employee-status',
  name: 'employee-status',
  meta: {
    menuId: 'HRM_SETTING',
    moduleName: 'employee-status',
    title: 'Employee Status',
  },
  children: [
    {
      path: '',
      name: 'employee-status-list',
      component: () => import('@/pages/setting/employee/status/EmployeeStatus.vue'),
    },
    {
      path: 'create',
      name: 'employee-status-create',
      component: () => import('@/pages/setting/employee/status/EmployeeStatusCreate.vue'),
      meta: {
        title: 'Create Employee Status',
      },
    },
  ],
}

const employeeTypeRoutes: RouteRecordRaw = {
  path: 'employee-type',
  name: 'employee-type',
  meta: {
    menuId: 'HRM_SETTING',
    moduleName: 'employee-type',
    title: 'Employee Type',
  },
  children: [
    {
      path: '',
      name: 'employee-type-list',
      component: () => import('@/pages/setting/employee/type/EmployeeType.vue'),
    },
    {
      path: 'create',
      name: 'employee-type-create',
      component: () => import('@/pages/setting/employee/type/EmployeeTypeCreate.vue'),
      meta: {
        title: 'Create Employee Type',
      },
    },
  ],
}

const employeeGradeRoutes: RouteRecordRaw = {
  path: 'employee-grade',
  name: 'employee-grade',
  meta: {
    menuId: 'HRM_SETTING',
    moduleName: 'employee-grade',
    title: 'Employee Grade',
  },
  children: [
    {
      path: '',
      name: 'employee-grade-list',
      component: () => import('@/pages/setting/employee/grade/EmployeeGrade.vue'),
    },
    {
      path: 'create',
      name: 'employee-grade-create',
      component: () => import('@/pages/setting/employee/grade/EmployeeGradeCreate.vue'),
      meta: {
        title: 'Create Employee Grade',
      },
    },
  ],
}

const languageRoutes: RouteRecordRaw = {
  path: 'language',
  name: 'language',
  meta: {
    menuId: 'HRM_SETTING',
    moduleName: 'language',
    title: 'Language',
  },
  children: [
    {
      path: '',
      name: 'language-list',
      component: () => import('@/pages/setting/employee/language/Language.vue'),
    },
    {
      path: 'create',
      name: 'language-create',
      component: () => import('@/pages/setting/employee/language/LanguageCreate.vue'),
      meta: {
        title: 'Create Language',
      },
    },
  ],
}

const socialMediaContactRoutes: RouteRecordRaw = {
  path: 'social-media-contact',
  name: 'social-media-contact',
  meta: {
    menuId: 'HRM_SETTING',
    moduleName: 'social-media-contact',
    title: 'Social Media Contact',
  },
  children: [
    {
      path: '',
      name: 'social-media-contact-list',
      component: () => import('@/pages/setting/employee/social-media-contact/SocialMediaContact.vue'),
    },
    {
      path: 'create',
      name: 'social-media-contact-create',
      component: () => import('@/pages/setting/employee/social-media-contact/SocialMediaContactCreate.vue'),
      meta: {
        title: 'Create Social Media Contact',
      },
    },
  ],
}

const employeeRaceRoutes: RouteRecordRaw = {
  path: 'race',
  name: 'employee-race',
  meta: {
    menuId: 'HRM_SETTING',
    moduleName: 'employee-race',
    title: 'Employee Race',
  },
  children: [
    {
      path: '',
      name: 'employee-race-list',
      component: () => import('@/pages/setting/employee/race/EmployeeRace.vue'),
    },
    {
      path: 'create',
      name: 'employee-race-create',
      component: () => import('@/pages/setting/employee/race/EmployeeRaceCreate.vue'),
      meta: {
        title: 'Create Employee Race',
      },
    },
  ],
}

const employeeNationalityRoutes: RouteRecordRaw = {
  path: 'nationality',
  name: 'employee-nationality',
  meta: {
    menuId: 'HRM_SETTING',
    moduleName: 'employee-nationality',
    title: 'Nationality',
  },
  children: [
    {
      path: '',
      name: 'employee-nationality-list',
      component: () => import('@/pages/setting/employee/nationality/EmployeeNationality.vue'),
    },
    {
      path: 'create',
      name: 'employee-nationality-create',
      component: () => import('@/pages/setting/employee/nationality/EmployeeNationalityCreate.vue'),
      meta: {
        title: 'Create Nationality',
      },
    },
  ],
}

const employeeContractTypeRoutes: RouteRecordRaw = {
  path: 'contract-type',
  name: 'contract-type',
  meta: {
    menuId: 'HRM_SETTING',
    moduleName: 'contract-type',
    title: 'Contract Type',
  },
  children: [
    {
      path: '',
      name: 'contract-type-list',
      component: () => import('@/pages/setting/employee/contract-type/ContractType.vue'),
    },
    {
      path: 'create',
      name: 'contract-type-create',
      component: () => import('@/pages/setting/employee/contract-type/ContractTypeCreate.vue'),
      meta: {
        title: 'Create Contract Type',
      },
    },
  ],
}

const maritalStatusRoutes: RouteRecordRaw = {
  path: 'marital-status',
  name: 'marital-status',
  meta: {
    menuId: 'HRM_SETTING',
    moduleName: 'marital-status',
    title: 'Marital Status',
  },
  children: [
    {
      path: '',
      name: 'marital-status-list',
      component: () => import('@/pages/setting/employee/marital-status/MaritalStatus.vue'),
    },
    {
      path: 'create',
      name: 'marital-status-create',
      component: () => import('@/pages/setting/employee/marital-status/MaritalStatusCreate.vue'),
      meta: {
        title: 'Create Marital Status',
      },
    },
  ],
}

export const employeeRoutes: Array<RouteRecordRaw> = [
  employeeCategoryRoutes,
  employeePositionRoutes,
  employeeStatusRoutes,
  employeeTypeRoutes,
  employeeGradeRoutes,
  languageRoutes,
  socialMediaContactRoutes,
  employeeRaceRoutes,
  employeeNationalityRoutes,
  employeeContractTypeRoutes,
  maritalStatusRoutes,
]
