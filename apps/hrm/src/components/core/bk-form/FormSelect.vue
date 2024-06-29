<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Props {
  name: string
  label: string
  list: Array<{ value: string, label: string }>
  isLoading?: boolean
  class?: string
  disabled?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem :class="cn('flex flex-col', props.class)">
      <FormLabel>{{ label }}</FormLabel>
      <FormControl :disabled="disabled">
        <Select v-bind="componentField">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="item in list"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
