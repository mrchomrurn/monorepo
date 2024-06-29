<script setup lang="ts" generic="T extends string">
import AutoFormLabel from './AutoFormLabel.vue'
import { beautifyObjectName } from './utils'
import type { FieldProps } from './interface'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

defineProps<FieldProps & {
  options?: readonly T[]
}>()

defineEmits<{ select: [value: T] }>()
</script>

<template>
  <FormField v-slot="slotProps" :name="fieldName">
    <FormItem :class="config?.class">
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || beautifyObjectName(label ?? fieldName) }}
      </AutoFormLabel>
      <FormControl>
        <slot v-bind="slotProps">
          <RadioGroup
            v-if="config?.component === 'radio'"
            :disabled="disabled"
            orientation="vertical"
            v-bind="{ ...slotProps.componentField }"
          >
            <div
              v-for="(option, index) in options"
              :key="option"
              class="mb-2 flex items-center gap-3 space-y-0"
            >
              <RadioGroupItem :id="`${option}-${index}`" :value="option" />
              <Label :for="`${option}-${index}`">{{ beautifyObjectName(option) }}</Label>
            </div>
          </RadioGroup>

          <Select
            v-else
            :disabled="disabled"
            v-bind="{ ...slotProps.componentField }"
            @update:model-value="$emit('select', $event as T)"
          >
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="config?.inputProps?.placeholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="option in options"
                :key="option"
                :value="option"
              >
                {{ beautifyObjectName(option) }}
              </SelectItem>
            </SelectContent>
          </Select>
        </slot>
      </FormControl>

      <FormDescription v-if="config?.description">
        {{ config.description }}
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
