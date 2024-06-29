<script lang="ts" setup>
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import type { FormType, SaveAction } from '@/types/Action'
import { useFormAction } from '@/composables/useFormAction'
import { useTabStore } from '@/store/tab'
import type { EmployeePositionSchema } from '@/composables/settings/useEmployeePosition'
import { schema, useEmployeePosition } from '@/composables/settings/useEmployeePosition'
import { AutoForm } from '@/components/ui/auto-form'

const props = defineProps<{
  id: string
  type: FormType
}>()

const { closeCurrentTab } = useTabStore()
const { handleSaveAction } = useFormAction()
const { getByIdQuery, createMutation, deleteQuery, editMutation } = useEmployeePosition()

const { mutate: createPosition, isPending: isCreating } = createMutation()
const { mutate: deletePosition, isPending: isDeleting } = deleteQuery()
const { mutate: editPosition, isPending: isEditing } = editMutation()

const { data, isLoading } = getByIdQuery((props.id))
const form = useForm<EmployeePositionSchema>({
  validationSchema: toTypedSchema(schema),
  initialValues: data.value,
})

watch(data, values => form.resetForm({ values }), { once: true })

const onSubmit = (formValues: EmployeePositionSchema, saveAction: SaveAction) => {
  if (props.type === 'edit') {
    editPosition({ body: formValues, id: props.id }, { onSuccess: () => handleSaveAction(saveAction, props.id) })
    return
  }

  createPosition(formValues, {
    onSuccess: (res) => {
      handleSaveAction(saveAction, res.data.id)
      if (props.type === 'duplicate') return
      form.resetForm({ values: {} }, { force: true })
    },
  })
}

const onDelete = async () => deletePosition(props.id, { onSuccess: closeCurrentTab })
</script>

<template>
  <AutoForm
    :id="id"
    :type="type"
    :schema="schema"
    :form="form"
    :disabled="type === 'show'"
    :field-config="{ posDes: { component: 'textarea' } }"
    :loading="isLoading || isCreating || isEditing || isDeleting"
    @submit="onSubmit"
    @delete="onDelete"
  />
</template>
