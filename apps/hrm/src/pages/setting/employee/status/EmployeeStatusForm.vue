<script lang="ts" setup>
import { watch } from 'vue'

// TODO: Remove vue-component-type-helpers
// import type { ComponentExposed } from 'vue-component-type-helpers'

import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { FormType, SaveAction } from '@/types/Action'
import { useFormAction } from '@/composables/useFormAction'
import { useTabStore } from '@/store/tab'
import type { EmployeeStatusSchema } from '@/composables/settings/useEmployeeStatus'
import { schema, useEmployeeStatus } from '@/composables/settings/useEmployeeStatus'
import { AutoForm } from '@/components/ui/auto-form'

const props = defineProps<{
  id: string
  type: FormType
}>()

const { closeCurrentTab } = useTabStore()
const { handleSaveAction } = useFormAction()
const { getByIdQuery, createMutation, deleteQuery, editMutation } = useEmployeeStatus()

const { mutate: createStatus, isPending: isCreating } = createMutation()
const { mutate: deleteStatus, isPending: isDeleting } = deleteQuery()
const { mutate: editStatus, isPending: isEditing } = editMutation()

const { data, isLoading } = getByIdQuery((props.id))
const form = useForm<EmployeeStatusSchema>({
  validationSchema: toTypedSchema(schema),
  initialValues: data.value,
})

watch(data, values => form.resetForm({ values }), { once: true })

const onSubmit = (formValues: EmployeeStatusSchema, saveAction: SaveAction) => {
  if (props.type === 'edit') {
    editStatus({ body: formValues, id: props.id }, { onSuccess: () => handleSaveAction(saveAction, props.id) })
    return
  }

  createStatus(formValues, {
    onSuccess: (res) => {
      handleSaveAction(saveAction, res.data.id)
      if (props.type === 'duplicate') return
      form.resetForm({ values: {} }, { force: true })
    },
  })
}

const onDelete = async () => deleteStatus(props.id, { onSuccess: closeCurrentTab })
</script>

<template>
  <AutoForm
    :id="id"
    :type="type"
    :schema="schema"
    :form="form"
    :disabled="type === 'show'"
    :field-config="{ statusDes: { component: 'textarea' } }"
    :loading="isLoading || isCreating || isEditing || isDeleting"
    @submit="onSubmit"
    @delete="onDelete"
  />
</template>
