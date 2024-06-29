<script setup lang="ts">
import { parseDate } from '@internationalized/date'
import { useField } from 'vee-validate'
import { computed } from 'vue'
import { Calendar as CalendarIcon } from 'lucide-vue-next'

import { beautifyObjectName } from './utils'
import AutoFormLabel from './AutoFormLabel.vue'
import type { FieldProps } from './interface'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'

import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const props = defineProps<FieldProps>()

const { handleChange, value } = useField<string>(() => props.fieldName)

const model = computed({
  get: () => value.value ? parseDate(value.value) : undefined,
  set: v => v,
})
</script>

<template>
  <FormField v-slot="slotProps" :name="fieldName">
    <FormItem>
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || beautifyObjectName(label ?? fieldName) }}
      </AutoFormLabel>
      <FormControl>
        <slot v-bind="slotProps">
          <div>
            <Popover>
              <PopoverTrigger as-child :disabled="disabled">
                <Button
                  variant="outline"
                  :class="cn(
                    'w-full justify-start text-left font-normal',
                    !slotProps.componentField.modelValue && 'text-muted-foreground',
                  )"
                >
                  <CalendarIcon class="mr-2 size-4" :size="16" />
                  {{ slotProps.componentField.modelValue || "Pick a date" }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0" align="start">
                <Calendar
                  v-model="model"
                  initial-focus
                  :name="slotProps.componentField.name"
                  @update:model-value="(value) => value && handleChange(value.toString())"
                />
              </PopoverContent>
            </Popover>
          </div>
        </slot>
      </FormControl>

      <FormDescription v-if="config?.description">
        {{ config.description }}
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
