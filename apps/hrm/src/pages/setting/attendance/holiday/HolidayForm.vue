<script lang="ts" setup>
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import type { FormType, SaveAction } from '@/types/Action'
import { useFormAction } from '@/composables/useFormAction'
import { useTabStore } from '@/store/tab'
import type { HolidaySchema } from '@/composables/settings/useHoliday'
import { schema, useHoliday } from '@/composables/settings/useHoliday'
import { AutoForm } from '@/components/ui/auto-form'

const props = defineProps<{
  id: string
  type: FormType
}>()

const { closeCurrentTab } = useTabStore()
const { handleSaveAction } = useFormAction()
const { getByIdQuery, createMutation, deleteQuery, editMutation } = useHoliday()

const { mutate: createHoliday, isPending: isCreating } = createMutation()
const { mutate: deleteHoliday, isPending: isDeleting } = deleteQuery()
const { mutate: editHoliday, isPending: isEditing } = editMutation()
const { data, isLoading } = getByIdQuery((props.id))

const form = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: data.value,
})

watch(data, values => form.resetForm({ values }))

const onDelete = () => deleteHoliday(props.id, { onSuccess: closeCurrentTab })

const onSubmit = (values: HolidaySchema, action: SaveAction) => {
  if (props.type === 'edit') {
    editHoliday({ body: values, id: props.id }, {
      onSuccess: () => handleSaveAction(action, props.id),
    })
    return
  }

  createHoliday(values, {
    onSuccess: (res) => {
      handleSaveAction(action, res.data.id)
      if (props.type === 'duplicate') return
      form.resetForm({ values: {} }, { force: true })
    },
  })
}
</script>

<template>
  <AutoForm
    :id="id"
    :schema="schema"
    :form="form"
    :disabled="type === 'show'"
    :type="type"
    :field-config="{ phDes: { component: 'textarea' }, phStartDate: { component: 'date' }, phEndDate: { component: 'date' } }"
    :loading="isLoading || isCreating || isEditing || isDeleting"
    @submit="onSubmit"
    @delete="onDelete"
  />
</template>
