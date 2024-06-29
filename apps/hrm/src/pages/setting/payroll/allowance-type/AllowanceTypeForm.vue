<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { watch } from 'vue'

import { AutoForm, AutoFormFieldEnum, AutoFormFieldMultipleSelect } from '@/components/ui/auto-form'
import type { AllowanceTypeSchema } from '@/composables/settings/useAllowanceType'
import { schema, useAllowanceType } from '@/composables/settings/useAllowanceType'
import { useFormAction } from '@/composables/useFormAction'
import { useTabStore } from '@/store/tab'
import type { FormType, SaveAction } from '@/types/Action'
import { useAssignmentType } from '@/composables/useAssignmentType'

const props = defineProps<{
  id: string
  type: FormType
}>()

const { closeCurrentTab } = useTabStore()
const { handleSaveAction } = useFormAction()
const { getByIdQuery, createMutation, deleteQuery, editMutation } = useAllowanceType()

const { mutate: createHoliday, isPending: isCreating } = createMutation()
const { mutate: editHoliday, isPending: isEditing } = editMutation()
const { mutate: deleteHoliday, isPending: isDeleting } = deleteQuery()
const { data, isLoading } = getByIdQuery((props.id))

const form = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: data.value,
})

const { options, detailOptions } = useAssignmentType(() => form.values?.assignment?.asmType)

watch(data, values => form.resetForm({ values }))

const onDelete = () => deleteHoliday(props.id, { onSuccess: closeCurrentTab })

const onSubmit = (values: AllowanceTypeSchema, action: SaveAction) => {
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

const onAsmTypeSelect = () => {
  form.setFieldValue('assignment.details', [], false)
}
</script>

<template>
  <AutoForm
    :id="id"
    :type="type"
    :schema="schema"
    :form="form"
    :disabled="type === 'show'"
    :loading="isLoading || isCreating || isEditing || isDeleting"
    :field-config=" {
      atDescription: { component: 'textarea' },
      atPayValue: { inputProps: { step: '0.5' } },
      atPayMultiplier: { inputProps: { step: '0.5' } },
    }"
    @submit="onSubmit"
    @delete="onDelete"
  >
    <template #assignment="{ disabled }">
      <AutoFormFieldEnum
        required
        field-name="assignment.asmType"
        label="Assignment Type"
        :options="options"
        :disabled="disabled"
        @select="onAsmTypeSelect"
      />

      <AutoFormFieldMultipleSelect
        required
        field-name="assignment.details"
        label="Assignment Details"
        :disabled="disabled"
        :items="detailOptions"
      />
    </template>
  </Autoform>
</template>
