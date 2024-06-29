import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export interface Tab {
  name: string
  label: string
  componentName: string
  routeParams?: Record<string, any>
}

export const useTabStore = defineStore('tab', () => {
  const router = useRouter()
  const route = useRoute()

  const tabs = ref<Tab[]>([{ label: 'Dashboard', name: 'dashboard', componentName: 'Dashboard' }])

  const currentActiveTab = computed(() => tabs.value.find(tab => tab.name === route.name))
  const cachedTabs = computed(() => tabs.value.map(tab => tab.componentName))

  const addTab = (tab: Tab) => {
    const exists = tabs.value.find(item => item.name === tab.name)
    if (!exists) tabs.value.push({ ...tab })
  }

  const onTabClick = (tab: Tab) => {
    const pushTo = router.resolve({ name: tab.name, params: tab.routeParams })
    if (pushTo) router.push(pushTo)
  }

  const onTabRemove = async (name: string) => {
    const index = tabs.value.findIndex(tab => tab.name === name)
    const currentTab = tabs.value[index]
    const prevTab = tabs.value[index - 1]

    if (index === -1) return

    // when delete current tab
    if (currentActiveTab.value?.name === currentTab.name) {
      tabs.value.splice(index, 1)
      onTabClick(prevTab)
    }
    else {
      tabs.value.splice(index, 1)
    }
  }

  const closeCurrentTab = () => onTabRemove(route.name?.toString() || '')

  const replaceCurrentTab = (routeName: string) => {
    const currentRouteName = route.name?.toString()
    if (!currentRouteName) return
    onTabRemove(currentRouteName)

    const targetRoute = router.resolve({ name: routeName })
    router.replace(targetRoute)
  }

  return {
    currentActiveTab,
    cachedTabs,
    tabs,
    onTabClick,
    addTab,
    onTabRemove,
    replaceCurrentTab,
    closeCurrentTab,
  }
})
