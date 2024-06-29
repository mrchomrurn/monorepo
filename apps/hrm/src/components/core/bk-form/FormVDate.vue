<script setup lang="ts">
import { CalendarIcon } from 'lucide-vue-next'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Calendar from '@/components/ui/v-calendar/Calendar.vue'

interface Props {
  name: string
  label: string
  mode?: string
  disabled?: boolean
}

defineProps<Props>()
</script>

<template>
  <FormField v-slot="{ value, componentField, meta }" :name="name">
    <FormItem>
      <FormLabel>{{ label }}</FormLabel>
      <div>
        <Popover>
          <PopoverTrigger as-child>
            <FormControl :disabled="disabled">
              <Button
                variant="outline"
                class="w-full justify-start text-left font-normal"
              >
                <CalendarIcon class="mr-2 size-4" :size="16" />
                {{ value ? format(value, 'dd MMMM yyyy') : "Pick a date" }}
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0" align="start">
            <Calendar
              v-bind="componentField"
              :model-modifiers="{ string: true }"
              :masks="{ modelValue: 'YYYY-MM-DD' }"
              :mode="mode"
              :is-required="meta.required"
            />
          </PopoverContent>
        </Popover>
      </div>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
