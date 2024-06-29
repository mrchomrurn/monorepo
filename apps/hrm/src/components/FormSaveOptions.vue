<script setup lang="ts">
import { CirclePlus, EllipsisVertical, LoaderCircle, Save, SquarePlus, SquareX, View } from 'lucide-vue-next'

import type { FormType, SaveAction } from '@/types/Action'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

defineProps<{ loading?: boolean, formType?: FormType }>()
defineEmits<{ select: [action: SaveAction] }>()
</script>

<template>
  <Button
    v-if="formType === 'edit'"
    :disabled="loading"
    class="gap-1.5"
  >
    <LoaderCircle
      v-if="loading"
      :size="18"
      class="animate-spin"
    />
    <Save v-else :size="18" />
    <span>{{ $t('actions.save') }}</span>
  </Button>

  <Button
    v-else
    :disabled="loading"
    class="gap-1.5"
  >
    <LoaderCircle
      v-if="loading"
      :size="20"
      class="animate-spin"
    />
    <CirclePlus v-else :size="20" />
    <span>{{ $t('actions.create') }}</span>
  </Button>

  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="outline"
        size="icon"
        :disabled="loading"
      >
        <EllipsisVertical :size="18" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem
        v-if="formType !== 'create'"
        class="gap-1.5"
        @select="$emit('select', 'new')"
      >
        <SquarePlus :size="16" />
        <span v-if="formType === 'edit'">{{ $t('actions.saveAndNew') }}</span>
        <span v-else>{{ $t('actions.createAndNew') }}</span>
      </DropdownMenuItem>
      <DropdownMenuItem class="gap-1.5" @select="$emit('select', 'view')">
        <View :size="16" />
        <span v-if="formType === 'edit'">{{ $t('actions.saveAndView') }}</span>
        <span v-else>{{ $t('actions.createAndView') }}</span>
      </DropdownMenuItem>
      <DropdownMenuItem class="gap-1.5" @select="$emit('select', 'close')">
        <SquareX :size="16" />
        <span v-if="formType === 'edit'">{{ $t('actions.saveAndClose') }}</span>
        <span v-else>{{ $t('actions.createAndClose') }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
