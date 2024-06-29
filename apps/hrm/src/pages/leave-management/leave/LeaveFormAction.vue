<script setup lang="ts">
import { Ban, Copy, EllipsisVertical, LoaderCircle, SquarePen } from 'lucide-vue-next'
import { computed } from 'vue'

import { AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useFormAction } from '@/composables/useFormAction'
import ApprovalSheet from '@/pages/leave-management/leave/approval/ApprovalSheet.vue'
import { useLeave } from '@/pages/leave-management/leave/useLeave'
import type { FormType } from '@/types/Action'
import BkAlertDialog from '@/components/BkAlertDialog.vue'

interface Props {
  formType: FormType
  loading?: boolean
  leaveId: string
}

const props = defineProps<Props>()

const { handleShowAction } = useFormAction()
const { cancelLeaveMutation, getByIdQuery } = useLeave()
const { mutate: cancelLeave, isPending } = cancelLeaveMutation()

const { data } = getByIdQuery(props.leaveId)

const loading = computed(() => props.loading || isPending.value)
const description = 'This action cannot be undone. This will permanently cancel your request.'
</script>

<template>
  <BkAlertDialog :description="description" @click="cancelLeave(leaveId)">
    <template #trigger>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button v-if="formType === 'show'" :disabled="loading">
            <span class="mr-1">{{ $t('actions.action') }}</span>
            <LoaderCircle
              v-if="loading"
              class="animate-spin"
              :size="18"
            />
            <EllipsisVertical v-else :size="18" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent class="w-36">
          <DropdownMenuItem
            v-if="data?.canEdit"
            class="gap-1.5"
            @select="handleShowAction('edit', leaveId)"
          >
            <SquarePen :size="16" />{{ $t('actions.edit') }}
          </DropdownMenuItem>

          <DropdownMenuItem class="gap-1.5" @select="handleShowAction('duplicate', leaveId)">
            <Copy :size="16" />{{ $t('actions.duplicate') }}
          </DropdownMenuItem>

          <AlertDialogTrigger as-child>
            <DropdownMenuItem v-if="data?.canCancel" class="gap-1.5 text-destructive focus:text-destructive">
              <Ban :size="16" /> {{ $t('actions.cancel') }}
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    </template>
  </BkAlertDialog>

  <ApprovalSheet :show-approval="data?.viewAuth && formType !== 'duplicate'" :leave-id="leaveId" />
</template>
