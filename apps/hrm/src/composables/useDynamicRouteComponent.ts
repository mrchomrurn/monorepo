import { capitalize, startCase } from 'lodash-es'
import { defineAsyncComponent, defineComponent, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { formComponent } from '@/lib/constants'
import type { FormType } from '@/types/Action'

// Generate dynamic component (component name is all we care) and create new route based on provided id. Use this dynamic component to cache in the KeepAlive component because all cache child need to have unique component name.
export const useDynamicRouteComponent = () => {
  const router = useRouter()
  const route = useRoute()

  const createRouteAndComponent = ({ action, id }: { action: FormType, id: string }) => {
    const { moduleName = '', menuId } = route.meta
    const title = `${capitalize(action)} ${startCase(moduleName)}`
    const name = `${moduleName}-${action}-${id}`
    const path = `${action}/${id}`

    const FormComponent = defineComponent({
      name,
      setup() {
        const form = defineAsyncComponent(formComponent[moduleName])
        return () => h(form)
      },
    })

    if (!router.hasRoute(name)) {
      router.addRoute(moduleName, {
        path,
        name,
        component: FormComponent,
        meta: { title, moduleName, menuId },
        props: { id, type: action },
      })
    }

    return name
  }

  return {
    createRouteAndComponent,
  }
}
