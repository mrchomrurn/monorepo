<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  name: string
  label: string
  disabled?: boolean
}

defineProps<Props>()
</script>

<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem>
      <FormLabel>{{ label }}</FormLabel>
      <FormControl :disabled="disabled">
        <Textarea v-bind="componentField" />
        <FormMessage />
      </FormControl>
    </FormItem>
  </FormField>
</template>
