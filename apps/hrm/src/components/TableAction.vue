<script setup lang="ts">
import type { ICellRendererParams } from '@ag-grid-community/core'
import { Ellipsis } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

import { AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useDynamicRouteComponent } from '@/composables/useDynamicRouteComponent'
import type { FormType } from '@/types/Action'
import BkAlertDialog from '@/components/BkAlertDialog.vue'

interface ActionGridContext {
  onDelete: (data: any) => void
}

const props = defineProps<{
  params: ICellRendererParams<any, any, ActionGridContext>
}>()

const router = useRouter()
const { createRouteAndComponent } = useDynamicRouteComponent()

const { context, data, node } = props.params

const handleSelect = async (action: FormType) => {
  const routeName = createRouteAndComponent({ action, id: node.id as string })
  router.push({ name: routeName })
}
</script>

<template>
  <div class="grid h-full place-items-center">
    <BkAlertDialog @click="context.onDelete(data)">
      <template #trigger>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              class="flex size-8 p-0 data-[state=open]:bg-muted"
            >
              <Ellipsis class="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            class="w-[160px]"
            hide-when-detached
          >
            <DropdownMenuItem
              @select="handleSelect('show')"
            >
              Show
            </DropdownMenuItem>
            <DropdownMenuItem
              @select="handleSelect('edit')"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              @select="handleSelect('duplicate')"
            >
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialogTrigger as-child>
              <DropdownMenuItem class="gap-1.5 text-destructive focus:text-destructive">
                {{ $t('actions.delete') }}
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
      </template>
    </BkAlertDialog>
  </div>
</template>
