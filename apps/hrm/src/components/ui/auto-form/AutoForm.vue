<script setup lang="ts" generic="T extends ZodObjectOrWrapped, K extends GenericObject">
import type { HTMLAttributes } from 'vue'
import { computed, toRefs } from 'vue'
import type { ZodAny, z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

import type { FormContext, GenericObject } from 'vee-validate'
import type { Config, ConfigItem, Dependency, Shape } from './interface'
import { provideDependencies } from './dependencies'
import type { ZodObjectOrWrapped } from './utils'
import { getBaseSchema, getBaseType, getDefaultValueInZodStack, getObjectFormSchema } from './utils'
import { Form } from '@/components/ui/form'
import { AutoFormField } from '@/components/ui/auto-form'
import type { FormType, SaveAction } from '@/types/Action'
import { useFormAction } from '@/composables/useFormAction'
import FormActions from '@/components/FormActions.vue'
import FormSaveOptions from '@/components/FormSaveOptions.vue'
import { cn } from '@/lib/utils'
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue'

const props = defineProps<{
  schema: T
  form?: FormContext<GenericObject, K>
  fieldConfig?: Config<z.infer<T>>
  dependencies?: Dependency<z.infer<T>>[]
  disabled?: boolean
  loading?: boolean
  class?: HTMLAttributes['class']
  type?: FormType
  id: string
}>()

const emits = defineEmits<{
  submit: [event: K, action: SaveAction]
  action: [action: FormType]
  delete: []
}>()

const { dependencies } = toRefs(props)
provideDependencies(dependencies)

const shapes = computed(() => {
  // @ts-expect-error ignore {} not assignable to object
  const val: { [key in keyof T]: Shape } = {}
  const baseSchema = getObjectFormSchema(props.schema)
  const shape = baseSchema.shape
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
      schema: baseItem,
    }
  })
  return val
})

const fields = computed(() => {
  // @ts-expect-error ignore {} not assignable to object
  const val: { [key in keyof z.infer<T>]: { shape: Shape, fieldName: string, config: ConfigItem } } = {}
  for (const key in shapes.value) {
    const shape = shapes.value[key]
    val[key as keyof z.infer<T>] = {
      shape,
      config: props.fieldConfig?.[key] as ConfigItem,
      fieldName: key,
    }
  }
  return val
})

const formComponent = computed(() => props.form ? 'form' : Form)
const formComponentProps = computed(() => {
  if (props.form) {
    return {
      onSubmit: props.form.handleSubmit(val => emits('submit', val, 'save')),
    }
  }
  else {
    const formSchema = toTypedSchema(props.schema)
    return {
      keepValues: true,
      validationSchema: formSchema,
      onSubmit: (val: K) => emits('submit', val, 'save'),
    }
  }
})

const onSaveActionSelected = async (action: SaveAction) => {
  const res = await props.form?.validate()
  if (!res) return
  if (res.valid && res.values) emits('submit', res.values as K, action)
}

const { handleShowAction } = useFormAction()
const onFormActionSelected = async (action: FormType | 'delete') => {
  if (action === 'delete') emits('delete')
  else handleShowAction(action, props.id)
}
</script>

<template>
  <ScrollArea>
    <component
      :is="formComponent"
      v-bind="formComponentProps"
    >
      <section class="sticky top-0 z-10 flex gap-2 border-b bg-accent px-4 py-2.5 drop-shadow-sm">
        <FormActions
          v-if="disabled"
          :loading
          @select="onFormActionSelected"
        />
        <FormSaveOptions
          v-else
          :loading
          :form-type="type"
          @select="onSaveActionSelected"
        />
      </section>

      <div :class="cn('space-y-4 px-4 py-2.5', props.class)">
        <slot name="customAutoForm" :fields="fields">
          <template v-for="(shape, key) of shapes" :key="key">
            <slot
              :shape="shape"
              :name="key.toString() as keyof z.infer<T>"
              :field-name="key.toString()"
              :config="fieldConfig?.[key as keyof typeof fieldConfig] as ConfigItem"
              :disabled="disabled"
            >
              <AutoFormField
                :config="fieldConfig?.[key as keyof typeof fieldConfig] as ConfigItem"
                :field-name="key.toString()"
                :shape="shape"
                :disabled="disabled"
              />
            </slot>
          </template>
        </slot>
      </div>

      <slot :shapes="shapes" />
    </component>
  </ScrollArea>
</template>
