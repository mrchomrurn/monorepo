<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import type { FormType, SaveAction } from '@/types/Action'
import { useFormAction } from '@/composables/useFormAction'
import type { LeaveSchema } from '@/pages/leave-management/leave/useLeave'
import { schema, useLeave } from '@/pages/leave-management/leave/useLeave'
import { useEmployees } from '@/composables/useEmployee'
import { FormAccordion, FormFileInput, FormInput, FormRemoteSelect, FormSelect, FormTextarea, FormTimePicker, FormVDate } from '@/components/core/bk-form'
import FormLayout from '@/components/core/bk-form/FormLayout.vue'
import LeaveFormAction from '@/pages/leave-management/leave/LeaveFormAction.vue'

const props = defineProps<{
  id: string
  type: FormType
}>()

const { getByIdQuery, createMutation, editMutation, getLeaveMasterByIdQuery } = useLeave()
const { mutate: createLeave, isPending: isCreating } = createMutation()
const { mutate: editLeave, isPending: isEditing } = editMutation()
const { data, isLoading } = getByIdQuery(props.id)

const form = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: data.value,
  keepValuesOnUnmount: true,
})

watch(data, values => form.resetForm({ values }))
const disabled = computed(() => props.type === 'show')

const employeeId = computed(() => form.values.leEmpId || '')
const { data: leaveTypes } = getLeaveMasterByIdQuery(employeeId)
const leaveTypeList = computed(() => leaveTypes.value?.map(type => ({ value: type.ltId, label: type.ltName })))

const employeeFilters = ref({ search: '', page: 0, size: 50 })
const { data: employees, isPending: isLoadingEmployees } = useEmployees(employeeFilters)

const employeeList = computed(() => employees.value?.list.map(employee => ({ value: employee.empId, label: employee.empName })))
const employeePlaceholder = computed(() => (data.value && { value: data.value.leEmpId, label: data.value.leEmpName }))

function onSearch(search: string) {
  employeeFilters.value.search = search
}

const { handleSaveAction } = useFormAction()

function onSubmit(data: LeaveSchema, action: SaveAction) {
  if (props.type === 'edit') {
    editLeave({ body: data, id: props.id }, {
      onSuccess: () => handleSaveAction(action, props.id),
    })
  }
  else {
    createLeave(data, {
      onSuccess: ({ data }) => {
        handleSaveAction(action, data.id)
        if (props.type === 'duplicate') return
        form.resetForm({ values: {} }, { force: true })
      },
    })
  }
}
</script>

<template>
  <FormLayout
    :form="form"
    :loading="isCreating || isEditing || isLoading"
    :form-type="type"
    @submit="onSubmit"
  >
    <template #form-action>
      <LeaveFormAction
        :form-type="type"
        :leave-id="id"
        :loading="isLoading"
      />
    </template>

    <FormRemoteSelect
      name="leEmpId"
      label="Employee"
      :list="employeeList || []"
      :is-loading="isLoadingEmployees"
      :item-placeholder="employeePlaceholder"
      :disabled="disabled"
      @search="onSearch"
    />

    <FormInput
      name="leReason"
      label="Reason"
      :disabled="disabled"
    />

    <FormFileInput
      name="leAttachments"
      label="Attachments"
      :disabled="disabled"
      multiple
    />

    <FormAccordion
      name="leaveDetails"
      label="Leave Details"
      sub-label="Details"
      :disabled="disabled"
    >
      <template #default="{ fieldName }">
        <FormSelect
          label="Leave Type"
          :name="`${fieldName}.ledTypeId`"
          :list="leaveTypeList || []"
          :disabled="disabled || !form.values.leEmpId"
          class="col-span-full"
        />
        <FormVDate
          :name="`${fieldName}.ledStartDate`"
          label="Start Date"
          :disabled="disabled"
        />
        <FormVDate
          :name="`${fieldName}.ledEndDate`"
          label="End Date"
          :disabled="disabled"
        />
        <FormTimePicker
          :name="`${fieldName}.ledStartTime`"
          label="Start Time"
          :disabled="disabled"
        />
        <FormTimePicker
          :name="`${fieldName}.ledEndTime`"
          label="End Time"
          :disabled="disabled"
        />
      </template>
    </FormAccordion>

    <FormTextarea
      name="leDescription"
      label="Description"
      :disabled="disabled"
    />
  </FormLayout>
</template>
