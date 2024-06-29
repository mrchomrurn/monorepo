import { createRouter, createWebHistory } from 'vue-router'

import { routes } from './routes'
import { useAuthStore } from '@/store/auth'
import { useTabStore } from '@/store/tab.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_PATH),
  routes,
})

router.beforeEach(async (to) => {
  // redirect to auth-web screen when in production
  if (!import.meta.env.DEV) {
    if (to.name === 'companies' || to.name === 'login') {
      window.location.replace('/')
      return false
    }
  }

  const tabStore = useTabStore()
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated && to.meta.middleware === 'auth') {
    authStore.purgeAuth()

    if (!import.meta.env.DEV) {
      const { origin } = window.location
      window.location.replace(`${origin}/login`)
      return
    }

    return { name: 'login' }
  }

  if (to.name === 'login' || to.path === '/' || to.name === 'NotFound') return

  let componentName: string = ''
  if (to.matched.length > 0) {
    const component = to.matched[to.matched.length - 1].components?.default
    if (typeof component === 'function') {
      // @ts-expect-error hacky way to get componet name
      const asyncComponent = await component()
      componentName = asyncComponent.default?.__name
    }
    else {
      componentName = component?.__name || component?.name || ''
    }
  }

  tabStore.addTab({
    label: to.meta.title?.toString() || 'Tab',
    name: to.name?.toString() || '',
    componentName,
    routeParams: to.params,
  })
})

export default router
