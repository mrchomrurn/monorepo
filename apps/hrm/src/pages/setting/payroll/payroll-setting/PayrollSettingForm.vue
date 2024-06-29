<script lang="ts" setup>
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import type { FormType, SaveAction } from '@/types/Action'
import { useFormAction } from '@/composables/useFormAction'
import { useTabStore } from '@/store/tab'
import type { PayrollSchema } from '@/composables/settings/usePayroll'
import { schema, usePayroll } from '@/composables/settings/usePayroll'
import { DependencyType } from '@/components/ui/auto-form/interface'
import { AutoForm } from '@/components/ui/auto-form'

const props = defineProps<{
  id: string
  type: FormType
}>()

const { closeCurrentTab } = useTabStore()
const { handleSaveAction } = useFormAction()
const { getByIdQuery, createMutation, deleteQuery, editMutation } = usePayroll()

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

const onSubmit = (values: PayrollSchema, action: SaveAction) => {
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
    :type="type"
    :schema="schema"
    :form="form"
    :disabled="type === 'show'"
    :loading="isLoading || isCreating || isEditing || isDeleting"
    :field-config=" {
      psDes: { component: 'textarea' },
      psNumOfWorkingDays: { inputProps: { step: '0.5' } },
      psNumOfWorkingHoursPerDay: { inputProps: { step: '0.5' } },
    }"
    :dependencies="[
      {
        sourceField: 'psType',
        type: DependencyType.REQUIRES,
        targetField: 'psSecondCutOffDay',
        when: type => type === 'Semimonthly',
      },
      {
        sourceField: 'psType',
        type: DependencyType.HIDES,
        targetField: 'psSecondCutOffDay',
        when: type => type !== 'Semimonthly',
      }]"
    @submit="onSubmit"
    @delete="onDelete"
  />
</template>
