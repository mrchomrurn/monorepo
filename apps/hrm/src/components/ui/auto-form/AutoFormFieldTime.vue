<script setup lang="ts">
import { format, parse } from 'date-fns'
import { Clock, X } from 'lucide-vue-next'
import { computed } from 'vue'

import { useField } from 'vee-validate'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/v-calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import type { FieldProps } from '@/components/ui/auto-form'
import { AutoFormLabel } from '@/components/ui/auto-form'

const props = defineProps<FieldProps>()

const { value, handleChange, resetField } = useField<string>(() => props.fieldName)

const timeModel = computed({
  get: () => value.value ? parse(value.value, 'HH:mm:ss', new Date()) : new Date(),
  set: v => handleChange(format(v, 'HH:mm:ss')),
})

const formatTime = (value: string) => {
  const parsedTime = parse(value, 'HH:mm:ss', new Date())
  return format(parsedTime, 'hh:mm a')
}
</script>

<template>
  <FormField :name="fieldName">
    <FormItem v-bind="$attrs">
      <AutoFormLabel
        v-if="!config?.hideLabel"
        class="truncate"
        :required="required"
      >
        {{ label }}
      </AutoFormLabel>
      <FormControl>
        <div>
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                class="w-full justify-center text-left font-normal"
                :class="!value && 'text-muted-foreground'"
                :disabled="disabled"
                @click="handleChange(format(timeModel, 'HH:mm:ss'))"
              >
                <Clock class="mr-2 size-4" />
                <span>{{ value ? formatTime(value) : "Pick a time" }}</span>
                <X
                  class="ml-auto size-4 rounded hover:bg-black/10"
                  :class="(required || !value) && 'invisible'"
                  @click.stop.self="resetField({ value: '' })"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" class="w-auto p-0">
              <Calendar
                v-model="timeModel"
                mode="time"
              />
            </PopoverContent>
          </Popover>
        </div>

        <FormMessage />
      </FormControl>
    </FormItem>
  </FormField>
</template>
