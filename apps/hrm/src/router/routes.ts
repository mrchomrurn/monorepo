import type { RouteRecordRaw } from 'vue-router'
import { settingRoutes } from './setting'
import { getToken } from '@/services/jwt'
import { leaveManagementRoutes } from '@/router/leave-management'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    children: [
      {
        path: '',
        name: 'company',
        component: () => import('@/pages/Company.vue'),
      },
      {
        path: 'login',
        name: 'login',
        beforeEnter: () => getToken() ? { path: '/' } : true,
        component: () => import('@/pages/authentication/Login.vue'),
        meta: {
          pageTitle: 'Login',
        },
      },
    ],
  },
  {
    path: '/:company',
    name: 'AppLayout',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: {
      middleware: 'auth',
    },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/pages/Dashboard.vue'),
        meta: {
          title: 'Dashboard',
          menuId: 'DASH',
        },
      },
      ...settingRoutes,
      ...leaveManagementRoutes,
      {
        path: ':pathMatch(.*)*',
        redirect(to) {
          const routes = to.matched[0].children
          const hasPredefinedRoute = routes.find(route => route.path === to.params.pathMatch[0])
          if (hasPredefinedRoute)
            return { path: `/${to.params.company}/${to.params.pathMatch[0]}` }
          else
            return { name: 'NotFound' }
        },
      },
    ],
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/components/404.vue'),
  },
]
