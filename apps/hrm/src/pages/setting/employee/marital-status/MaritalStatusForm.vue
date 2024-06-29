<script lang="ts" setup>
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import type { FormType, SaveAction } from '@/types/Action'
import { useFormAction } from '@/composables/useFormAction'
import { useTabStore } from '@/store/tab'
import { AutoForm } from '@/components/ui/auto-form'
import type { MaritalStatusSchema } from '@/composables/settings/useMaritalStatus'
import { schema, useMaritalStatus } from '@/composables/settings/useMaritalStatus'

const props = defineProps<{
  id: string
  type: FormType
}>()

const { closeCurrentTab } = useTabStore()
const { handleSaveAction } = useFormAction()
const { getByIdQuery, createMutation, deleteQuery, editMutation } = useMaritalStatus()

const { mutate: createMaritalStatus, isPending: isCreating } = createMutation()
const { mutate: deleteMaritalStatus, isPending: isDeleting } = deleteQuery()
const { mutate: editMaritalStatus, isPending: isEditing } = editMutation()

const { data, isLoading } = getByIdQuery((props.id))
const form = useForm<MaritalStatusSchema>({
  validationSchema: toTypedSchema(schema),
  initialValues: data.value,
})

watch(data, values => form.resetForm({ values }), { once: true })

const onDelete = async () => deleteMaritalStatus(props.id, { onSuccess: closeCurrentTab })

const onSubmit = (formValues: MaritalStatusSchema, saveAction: SaveAction) => {
  if (props.type === 'edit') {
    editMaritalStatus({ body: formValues, id: props.id }, { onSuccess: () => handleSaveAction(saveAction, props.id) })
    return
  }

  createMaritalStatus(formValues, {
    onSuccess: (res) => {
      handleSaveAction(saveAction, res.data.id)
      if (props.type === 'duplicate') return
      form.resetForm({ values: {} }, { force: true })
    },
  })
}
</script>

<template>
  <AutoForm
    :id="id"
    :type="type"
    :schema="schema"
    :form="form"
    :disabled="type === 'show'"
    :field-config="{ msDes: { component: 'textarea' } }"
    :loading="isLoading || isCreating || isEditing || isDeleting"
    @submit="onSubmit"
    @delete="onDelete"
  />
</template>
