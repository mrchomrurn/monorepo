<script setup lang="ts">
import { Clock, X } from 'lucide-vue-next'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Calendar from '@/components/ui/v-calendar/Calendar.vue'

interface Props {
  name: string
  label: string
  disabled?: boolean
}

defineProps<Props>()
</script>

<template>
  <FormField v-slot="{ value, resetField, handleChange }" :name="name">
    <FormItem>
      <FormLabel>{{ label }}</FormLabel>
      <div>
        <Popover>
          <PopoverTrigger as-child>
            <FormControl :disabled="disabled">
              <Button
                variant="outline"
                class="w-full justify-center text-left font-normal"
              >
                <Clock class="mr-2 size-4" />
                <span>
                  {{
                    value
                      ? format(value, 'hh:mm a')
                      : 'Pick a time'
                  }}
                </span>
                <X
                  class="ml-auto size-4 rounded hover:bg-black/10"
                  :class="!value && 'invisible'"
                  @click.stop="resetField({ value: undefined })"
                />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent align="start" class="w-auto p-0">
            <Calendar
              :model-value="value ?? new Date()"
              mode="time"
              @update:model-value="handleChange"
            />
          </PopoverContent>
        </Popover>
      </div>

      <FormMessage />
    </FormItem>
  </FormField>
</template>
