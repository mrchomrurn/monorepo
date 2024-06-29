<script setup lang="ts" generic="T extends ZodRawShape">
import type { ZodAny, ZodObject, ZodRawShape } from 'zod'
import { computed, provide } from 'vue'
import { FieldContextKey, useField } from 'vee-validate'

import AutoFormField from './AutoFormField.vue'
import type { Config, ConfigItem, Shape } from './interface'
import { beautifyObjectName, getBaseSchema, getBaseType, getDefaultValueInZodStack } from './utils'
import AutoFormLabel from './AutoFormLabel.vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FormItem } from '@/components/ui/form'
import { cn } from '@/lib/utils'

const props = defineProps<{
  fieldName: string
  required?: boolean
  config?: Config<T>
  schema?: ZodObject<T>
  disabled?: boolean
  label?: string
}>()

const shapes = computed(() => {
  // @ts-expect-error ignore {} not assignable to object
  const val: { [key in keyof T]: Shape } = {}

  if (!props.schema)
    return
  const shape = getBaseSchema(props.schema)?.shape
  if (!shape)
    return
  Object.keys(shape).forEach((name) => {
    const item = shape[name] as ZodAny
    const baseItem = getBaseSchema(item) as ZodAny
    let options = (baseItem && 'values' in baseItem._def) ? baseItem._def.values as string[] : undefined
    if (!Array.isArray(options) && typeof options === 'object')
      options = Object.values(options)

    val[name as keyof T] = {
      type: getBaseType(item),
      default: getDefaultValueInZodStack(item),
      options,
      required: !['ZodOptional', 'ZodNullable'].includes(item._def.typeName),
      schema: item,
    }
  })
  return val
})

const fieldContext = useField(props.fieldName)
// @ts-expect-error ignore missing `id`
provide(FieldContextKey, fieldContext)
</script>

<template>
  <section>
    <slot v-bind="{ ...props, shapes }">
      <Accordion
        as-child
        collapsible
        type="single"
        class="w-full"
        :default-value="fieldName"
      >
        <FormItem>
          <AccordionItem :value="fieldName" class="border-none ">
            <AccordionTrigger class="flex-initial">
              <AutoFormLabel class="mr-4 text-base hover:cursor-pointer" :required="required">
                {{ schema?.description || label || beautifyObjectName(fieldName) }}
              </AutoFormLabel>
            </AccordionTrigger>
            <AccordionContent :class="cn('space-y-4 p-1', (config as ConfigItem)?.class)">
              <template v-for="(shape, key) in shapes" :key="key">
                <AutoFormField
                  :config="config?.[key as keyof typeof config] as ConfigItem"
                  :field-name="`${fieldName}.${key.toString()}`"
                  :label="key.toString()"
                  :shape="shape"
                  :disabled="disabled"
                />
              </template>
            </AccordionContent>
          </AccordionItem>
        </FormItem>
      </Accordion>
    </slot>
  </section>
</template>
