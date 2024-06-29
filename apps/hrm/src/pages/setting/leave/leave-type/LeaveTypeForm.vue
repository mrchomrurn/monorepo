<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { watch } from 'vue'

import type { Config } from '@/components/ui/auto-form'
import { AutoForm, AutoFormFieldEnum, AutoFormFieldMultipleSelect } from '@/components/ui/auto-form'
import { useFormAction } from '@/composables/useFormAction'
import { useTabStore } from '@/store/tab'
import type { FormType, SaveAction } from '@/types/Action'
import type { LeaveTypeSchema } from '@/composables/settings/useLeaveType'
import { schema, useLeaveType } from '@/composables/settings/useLeaveType'
import { useAssignmentType } from '@/composables/useAssignmentType'

const props = defineProps<{
  id: string
  type: FormType
}>()

const { closeCurrentTab } = useTabStore()
const { handleSaveAction } = useFormAction()
const { getByIdQuery, createMutation, deleteQuery, editMutation } = useLeaveType()

const { mutate: createHoliday, isPending: isCreating } = createMutation()
const { mutate: editHoliday, isPending: isEditing } = editMutation()
const { mutate: deleteHoliday, isPending: isDeleting } = deleteQuery()
const { data, isLoading } = getByIdQuery((props.id))

const form = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: data.value,
  keepValuesOnUnmount: true,
})

const { options, detailOptions, type: asmType } = useAssignmentType(() => form.values?.assignment?.asmType)

watch(data, values => form.resetForm({ values }))

const onDelete = () => deleteHoliday(props.id, { onSuccess: closeCurrentTab })

function onSubmit(values: LeaveTypeSchema, action: SaveAction) {
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

function onAsmTypeSelect() {
  form.setFieldValue('assignment.details', [], false)
}

const fieldConfig: Config<LeaveTypeSchema> = {
  ltDescription: { component: 'textarea' },
  ltDeductionValue: { inputProps: { step: '0.1' }, class: '!col-span-1' },
  ltDeductionMultiplier: { inputProps: { step: '0.1' }, class: '!col-span-1' },
  ltDeductionType: { class: '!col-span-1' },
  ltTermType: { class: '!col-span-2' },
  ltTerm: { class: '!col-span-1' },
  ltEffectiveDate: { component: 'date' },
  additionalTermByEmploymentLengths: { class: 'grid grid-cols-3 gap-2 space-y-0' },
}
</script>

<template>
  <AutoForm
    :id="id"
    :type="type"
    :schema="schema"
    :form="form"
    :field-config="fieldConfig"
    :disabled="type === 'show'"
    :loading="isLoading || isCreating || isEditing || isDeleting"
    class="group grid grid-cols-3 gap-x-2 *:col-span-full"
    @submit="onSubmit"
    @delete="onDelete"
  >
    <template #assignment="{ disabled }">
      <AutoFormFieldEnum
        required
        field-name="assignment.asmType"
        label="Assignment Type"
        :config="{ class: '!col-span-1' }"
        :options="options"
        :disabled="disabled"
        @select="onAsmTypeSelect"
      />

      <AutoFormFieldMultipleSelect
        required
        field-name="assignment.details"
        label="Assignment Details"
        :config="{ class: '!col-span-2' }"
        :disabled="disabled || !asmType"
        :items="detailOptions"
      />
    </template>
  </Autoform>
</template>
