<script setup lang="ts" generic="T extends z.ZodAny">
import * as z from 'zod'
import type { HTMLAttributes } from 'vue'
import { computed, provide } from 'vue'
import { FieldArray, FieldContextKey, useField } from 'vee-validate'
import { Plus, Trash } from 'lucide-vue-next'

import type { Config, ConfigItem } from './interface'
import { beautifyObjectName, getBaseType } from './utils'
import AutoFormField from './AutoFormField.vue'
import AutoFormLabel from './AutoFormLabel.vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FormItem, FormMessage } from '@/components/ui/form'

const props = defineProps<{
  fieldName: string
  required?: boolean
  config?: Config<T>
  schema?: z.ZodArray<T>
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()

function isZodArray(
  item: z.ZodArray<any> | z.ZodDefault<any>,
): item is z.ZodArray<any> {
  return item instanceof z.ZodArray
}

function isZodDefault(
  item: z.ZodArray<any> | z.ZodDefault<any>,
): item is z.ZodDefault<any> {
  return item instanceof z.ZodDefault
}

const itemShape = computed(() => {
  if (!props.schema)
    return

  const schema: z.ZodAny = isZodArray(props.schema)
    ? props.schema._def.type
    : isZodDefault(props.schema)
    // @ts-expect-error missing schema
      ? props.schema._def.innerType._def.type
      : null

  return {
    type: getBaseType(schema),
    schema,
  }
})

const fieldContext = useField(props.fieldName)
// @ts-expect-error ignore missing `id`
provide(FieldContextKey, fieldContext)
</script>

<template>
  <FieldArray
    v-slot="{ fields, remove, push }"
    as="section"
    :name="fieldName"
  >
    <slot v-bind="props">
      <Accordion
        collapsible
        as-child
        type="multiple"
        class="w-full"
      >
        <FormItem>
          <AccordionItem :value="fieldName" class="border-none">
            <AccordionTrigger class="flex-initial">
              <AutoFormLabel class="mr-4 text-base hover:cursor-pointer" :required="required">
                {{ schema?.description || beautifyObjectName(fieldName) }}
              </AutoFormLabel>
            </AccordionTrigger>

            <AccordionContent>
              <template v-for="(field, index) of fields" :key="field.key">
                <div class="mb-2 p-1">
                  <slot
                    name="field"
                    :field-name="`${fieldName}[${index}]`"
                    :shape="itemShape!"
                  >
                    <AutoFormField
                      :field-name="`${fieldName}[${index}]`"
                      :label="fieldName"
                      :shape="itemShape!"
                      :config="config as ConfigItem"
                      :disabled="disabled"
                    />
                  </slot>

                  <div class="!my-2 flex justify-end">
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      :class="[disabled && 'hidden']"
                      @click="remove(index)"
                    >
                      <Trash :size="16" />
                    </Button>
                  </div>
                  <Separator v-if="!field.isLast" />
                </div>
              </template>

              <Button
                type="button"
                variant="outline"
                class="flex items-center"
                :class="[disabled && 'hidden']"
                @click="push(null)"
              >
                <Plus class="mr-1" :size="16" />
                Add
              </Button>
            </AccordionContent>

            <FormMessage />
          </AccordionItem>
        </FormItem>
      </Accordion>
    </slot>
  </FieldArray>
</template>
