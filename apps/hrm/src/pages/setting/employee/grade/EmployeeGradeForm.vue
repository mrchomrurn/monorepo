<script lang="ts" setup>
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import type { FormType, SaveAction } from '@/types/Action'
import { useFormAction } from '@/composables/useFormAction'
import { useTabStore } from '@/store/tab'
import { AutoForm } from '@/components/ui/auto-form'
import type { EmployeeGradeSchema } from '@/composables/settings/useEmployeeGrade'
import { schema, useEmployeeGrade } from '@/composables/settings/useEmployeeGrade'

const props = defineProps<{
  id: string
  type: FormType
}>()

const { closeCurrentTab } = useTabStore()
const { handleSaveAction } = useFormAction()
const { getByIdQuery, createMutation, deleteQuery, editMutation } = useEmployeeGrade()

const { mutate: createType, isPending: isCreating } = createMutation()
const { mutate: deleteType, isPending: isDeleting } = deleteQuery()
const { mutate: editType, isPending: isEditing } = editMutation()

const { data, isLoading } = getByIdQuery((props.id))
const form = useForm<EmployeeGradeSchema>({
  validationSchema: toTypedSchema(schema),
  initialValues: data.value,
})

watch(data, values => form.resetForm({ values }), { once: true })

const onSubmit = (formValues: EmployeeGradeSchema, saveAction: SaveAction) => {
  if (props.type === 'edit') {
    editType({ body: formValues, id: props.id }, { onSuccess: () => handleSaveAction(saveAction, props.id) })
    return
  }

  createType(formValues, {
    onSuccess: (res) => {
      handleSaveAction(saveAction, res.data.id)
      if (props.type === 'duplicate') return
      form.resetForm({ values: {} }, { force: true })
    },
  })
}

const onDelete = async () => deleteType(props.id, { onSuccess: closeCurrentTab })
</script>

<template>
  <AutoForm
    :id="id"
    :type="type"
    :schema="schema"
    :form="form"
    :disabled="type === 'show'"
    :field-config="{ gradeDes: { component: 'textarea' } }"
    :loading="isLoading || isCreating || isEditing || isDeleting"
    @submit="onSubmit"
    @delete="onDelete"
  />
</template>
