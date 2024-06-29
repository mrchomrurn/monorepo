<script setup lang="ts">
import { EllipsisVertical, LoaderCircle, SaveAll, SquarePen, Trash2 } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { FormType } from '@/types/Action'
import BkAlertDialog from '@/components/BkAlertDialog.vue'
import { AlertDialogTrigger } from '@/components/ui/alert-dialog'

defineProps<{ loading?: boolean, hideDelete?: boolean, hideEdit?: boolean }>()
defineEmits<{ select: [action: FormType | 'delete'] }>()
</script>

<template>
  <BkAlertDialog @click="$emit('select', 'delete')">
    <template #trigger>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button class="gap-2" :disabled="loading">
            {{ $t('actions.action') }}
            <LoaderCircle
              v-if="loading"
              class="animate-spin"
              :size="18"
            />
            <EllipsisVertical v-else :size="18" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            v-if="!hideEdit"
            class="gap-1.5"
            @select="$emit('select', 'edit')"
          >
            <SquarePen :size="16" />{{ $t('actions.edit') }}
          </DropdownMenuItem>
          <DropdownMenuItem class="gap-1.5" @select="$emit('select', 'duplicate')">
            <SaveAll :size="16" />{{ $t('actions.duplicate') }}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger v-if="!hideDelete" as-child>
            <DropdownMenuItem class="gap-1.5 text-destructive focus:text-destructive">
              <Trash2 :size="16" /> {{ $t('actions.delete') }}
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    </template>
  </BkAlertDialog>
</template>
