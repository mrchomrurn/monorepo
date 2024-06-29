import { useRoute } from 'vue-router'

import { useTabStore } from '@/store/tab'
import type { FormType, SaveAction } from '@/types/Action'
import { useDynamicRouteComponent } from '@/composables/useDynamicRouteComponent'

export const useFormAction = () => {
  const tab = useTabStore()
  const route = useRoute()
  const { createRouteAndComponent } = useDynamicRouteComponent()

  const handleSaveAction = (saveAction: SaveAction, id: string) => {
    const { moduleName = '' } = route.meta

    if (saveAction === 'new')
      tab.replaceCurrentTab(`${moduleName}-create`)

    if (saveAction === 'view') {
      const routeName = createRouteAndComponent({ action: 'show', id })
      tab.replaceCurrentTab(routeName)
    }

    if (saveAction === 'close')
      tab.onTabRemove(route.name?.toString() || '')
  }

  const handleShowAction = (action: FormType, id: string) => {
    const routeName = createRouteAndComponent({ action, id })
    tab.replaceCurrentTab(routeName)
  }

  return {
    handleSaveAction,
    handleShowAction,
  }
}
