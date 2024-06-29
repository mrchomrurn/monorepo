<script lang="ts" setup>
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import type { FormType, SaveAction } from '@/types/Action'
import { useFormAction } from '@/composables/useFormAction'
import { useTabStore } from '@/store/tab'
import { AutoForm } from '@/components/ui/auto-form'
import type { EmployeeNationalitySchema } from '@/composables/settings/useEmployeeNationality'
import { schema, useEmployeeNationality } from '@/composables/settings/useEmployeeNationality'

const props = defineProps<{
  id: string
  type: FormType
}>()

const { closeCurrentTab } = useTabStore()
const { handleSaveAction } = useFormAction()
const { getByIdQuery, createMutation, deleteQuery, editMutation } = useEmployeeNationality()

const { mutate: createNationality, isPending: isCreating } = createMutation()
const { mutate: deleteNationality, isPending: isDeleting } = deleteQuery()
const { mutate: editNationality, isPending: isEditing } = editMutation()

const { data, isLoading } = getByIdQuery((props.id))
const form = useForm<EmployeeNationalitySchema>({
  validationSchema: toTypedSchema(schema),
  initialValues: data.value,
})

watch(data, values => form.resetForm({ values }), { once: true })

const onDelete = async () => deleteNationality(props.id, { onSuccess: closeCurrentTab })

const onSubmit = (formValues: EmployeeNationalitySchema, saveAction: SaveAction) => {
  if (props.type === 'edit') {
    editNationality({ body: formValues, id: props.id }, { onSuccess: () => handleSaveAction(saveAction, props.id) })
    return
  }

  createNationality(formValues, {
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
    :field-config="{ natDes: { component: 'textarea' } }"
    :loading="isLoading || isCreating || isEditing || isDeleting"
    @submit="onSubmit"
    @delete="onDelete"
  />
</template>
