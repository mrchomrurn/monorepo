<script setup lang="ts" generic="T extends GenericObject">
import type { FormContext, GenericObject } from 'vee-validate'

import FormSaveOptions from '@/components/FormSaveOptions.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { FormType, SaveAction } from '@/types/Action'

interface Props {
  form: FormContext<GenericObject, T>
  loading?: boolean
  formType?: FormType
}

const props = defineProps<Props>()
const emits = defineEmits<{
  (e: 'submit', values: T, action: SaveAction,): void
}>()

const onSubmit = props.form.handleSubmit(values => emits('submit', values, 'save'))

async function onSaveActionSelected(action: SaveAction) {
  const { valid, values } = await props.form.validate()
  if (valid && values)
    emits('submit', values as T, action)
}
</script>

<template>
  <ScrollArea>
    <form @submit="onSubmit">
      <section class="sticky top-0 z-10 flex items-center gap-2 border-b px-4 py-2.5 drop-shadow-sm">
        <FormSaveOptions
          v-if="formType !== 'show'"
          :loading="loading"
          :form-type="formType"
          @select="onSaveActionSelected"
        />
        <slot name="form-action" />
      </section>

      <section class="space-y-4 p-4">
        <slot />
      </section>
    </form>
  </ScrollArea>
</template>
