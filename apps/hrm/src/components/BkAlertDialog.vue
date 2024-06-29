<script setup lang="ts">
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

defineProps<{ description?: string }>()
defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <AlertDialog>
    <slot name="trigger">
      <AlertDialogTrigger>Open</AlertDialogTrigger>
    </slot>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          {{ description || 'This action cannot be undone. This will permanently delete your data from our servers.' }}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>{{ $t('actions.cancel') }}</AlertDialogCancel>
        <AlertDialogAction variant="destructive" @click="$emit('click')">
          {{ $t('actions.confirm') }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
