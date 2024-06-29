import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { AxiosError } from 'axios'

import type { Menu, MenuResponse } from '@/composables/useMenu'
import { api } from '@/services/api'
import type { MainMenu, SubMenu } from '@/types/Menu'
import { useNotification } from '@/composables/useNotification'

const dashboardMenu = {
  id: 'dashboard',
  name: 'Dashboard',
  appId: 'dashboard',
  menu: [],
  icon: '',
  inactive: 'N',
  line: 0,
}

function organizeCategoryReducer(acc: Record<string, Array<SubMenu>>, subMenu: SubMenu) {
  if (!acc[subMenu.type]) acc[subMenu.type] = []
  acc[subMenu.type].push(subMenu)
  return acc
}

export const useMenuStore = defineStore('menu', () => {
  const { onError } = useNotification()

  const mainMenu = ref<MainMenu[]>([dashboardMenu])
  const isLoading = ref(false)
  const subMenus = ref<Record<string, Record<string, SubMenu[]>>>({})

  async function fetchMenu() {
    try {
      isLoading.value = true

      const res = await api.post<MenuResponse>('/discovery/menu/hrm')
      const { data } = res.data
      mainMenu.value = mainMenu.value.concat(data)

      for (const main of data)
        subMenus.value[main.id] = main.menu.reduce(organizeCategoryReducer, {})
    }
    catch (error) {
      onError(error as AxiosError)
    }
    finally {
      isLoading.value = false
    }
  }

  const openSubMenu = ref(false)
  const currentSubMenu = ref<Record<string, SubMenu[]>>({})
  const accordionSubMenu = ref<string[]>([])
  const clickedMenuId = ref('')

  function onMenuClicked({ id }: Menu) {
    clickedMenuId.value = id
    if (id === 'dashboard') {
      openSubMenu.value = false
      return
    }

    openSubMenu.value = true
    currentSubMenu.value = subMenus.value[id]
    accordionSubMenu.value = Object.keys(currentSubMenu.value)
  }

  const route = useRoute()
  const activeMainMenu = computed((): Menu => {
    const menuId = route.meta.menuId as string

    if (menuId) {
      const menu = mainMenu.value?.find(
        menu => menu.id.toLowerCase() === menuId.toLowerCase(),
      )

      if (menu) return menu
    }

    return { id: 'dashboard', name: 'Dashboard', appId: 'dashboard', menu: [], icon: '', inactive: 'N', line: 0 }
  })

  function generateMenuUrl(menu: SubMenu) {
    const { params: { company = '' } } = route
    return `/${company}${menu.link}`
  }

  return {
    mainMenu,
    openSubMenu,
    currentSubMenu,
    isLoading,
    activeMainMenu,
    clickedMenuId,
    accordionSubMenu,
    fetchMenu,
    onMenuClicked,
    generateMenuUrl,
  }
})
