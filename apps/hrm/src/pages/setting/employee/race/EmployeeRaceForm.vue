<script lang="ts" setup>
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import type { FormType, SaveAction } from '@/types/Action'
import { useFormAction } from '@/composables/useFormAction'
import { useTabStore } from '@/store/tab'
import { AutoForm } from '@/components/ui/auto-form'
import type { EmployeeRaceSchema } from '@/composables/settings/useEmployeeRace'
import { schema, useEmployeeRace } from '@/composables/settings/useEmployeeRace'

const props = defineProps<{
  id: string
  type: FormType
}>()

const { closeCurrentTab } = useTabStore()
const { handleSaveAction } = useFormAction()
const { getByIdQuery, createMutation, deleteQuery, editMutation } = useEmployeeRace()

const { mutate: createRace, isPending: isCreating } = createMutation()
const { mutate: deleteRace, isPending: isDeleting } = deleteQuery()
const { mutate: editRace, isPending: isEditing } = editMutation()

const { data, isLoading } = getByIdQuery((props.id))
const form = useForm<EmployeeRaceSchema>({
  validationSchema: toTypedSchema(schema),
  initialValues: data.value,
})

watch(data, values => form.resetForm({ values }), { once: true })

const onDelete = async () => deleteRace(props.id, { onSuccess: closeCurrentTab })

const onSubmit = (formValues: EmployeeRaceSchema, saveAction: SaveAction) => {
  if (props.type === 'edit') {
    editRace({ body: formValues, id: props.id }, { onSuccess: () => handleSaveAction(saveAction, props.id) })
    return
  }

  createRace(formValues, {
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
    :field-config="{ raceDes: { component: 'textarea' } }"
    :loading="isLoading || isCreating || isEditing || isDeleting"
    @submit="onSubmit"
    @delete="onDelete"
  />
</template>
