<script lang="ts" setup>
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { ZodArray, ZodObject } from 'zod'

import type { FormType, SaveAction } from '@/types/Action'
import { useFormAction } from '@/composables/useFormAction'
import { useTabStore } from '@/store/tab'
import type { WorkShiftSchema } from '@/composables/settings/useWorkShift'
import { schema, useWorkShift } from '@/composables/settings/useWorkShift'
import {
  AutoForm,
  AutoFormField,
  AutoFormFieldArray,
  AutoFormFieldEnum,
  AutoFormFieldMultipleSelect,
  AutoFormFieldObject,
  AutoFormLabel,
} from '@/components/ui/auto-form'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FormItem } from '@/components/ui/form'
import { useAssignmentType } from '@/composables/useAssignmentType'

const props = defineProps<{
  id: string
  type: FormType
}>()

const { closeCurrentTab } = useTabStore()
const { handleSaveAction } = useFormAction()
const { getByIdQuery, createMutation, deleteQuery, editMutation } = useWorkShift()

const { mutate: createHoliday, isPending: isCreating } = createMutation()
const { mutate: deleteHoliday, isPending: isDeleting } = deleteQuery()
const { mutate: editHoliday, isPending: isEditing } = editMutation()
const { data, isLoading } = getByIdQuery((props.id))

const form = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: data.value,
  keepValuesOnUnmount: true,
})

const { options, detailOptions } = useAssignmentType(() => form.values.assignment?.asmType)

watch(data, values => form.resetForm({ values }))

const onDelete = () => deleteHoliday(props.id, { onSuccess: closeCurrentTab })

const onSubmit = (values: WorkShiftSchema, action: SaveAction) => {
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
</script>

<template>
  <AutoForm
    :id="id"
    :type="type"
    :schema="schema"
    :form="form"
    :disabled="type === 'show'"
    :field-config="{ wsDes: { component: 'textarea' } }"
    :loading="isLoading || isCreating || isEditing || isDeleting"
    @submit="onSubmit"
    @delete="onDelete"
  >
    <template #listDetail="{ fieldName, shape, disabled }">
      <AutoFormFieldArray
        :field-name="fieldName"
        :schema="shape.schema as unknown as ZodArray<any, any>"
        :disabled="disabled"
        :required="shape.required"
      >
        <template #field="slotProps">
          <AutoFormFieldObject
            :field-name="slotProps.fieldName"
            :schema="slotProps.shape.schema as unknown as ZodObject<any, any>"
          >
            <template #default="{ shapes }">
              <Accordion
                as-child
                collapsible
                class="w-full"
                :default-value="slotProps.fieldName"
              >
                <FormItem>
                  <AccordionItem :value="slotProps.fieldName" class="border-none">
                    <AccordionTrigger class="flex-initial">
                      <AutoFormLabel class="mr-4 truncate hover:cursor-pointer" required>
                        Details
                      </AutoFormLabel>
                    </AccordionTrigger>
                    <AccordionContent class="grid grid-cols-4 gap-2 gap-y-4 p-1">
                      <template v-for="(fieldShape, key) in shapes" :key="key">
                        <AutoFormField
                          v-if="fieldShape.schema?.description !== 'wsdId'"
                          :field-name="`${slotProps.fieldName}.${key.toString()}`"
                          :shape="fieldShape"
                          :disabled="disabled"
                          :config="{
                            class: 'col-span-2',
                            component: fieldShape.type === 'ZodString' ? 'time' : undefined,
                          }"
                        />
                      </template>
                    </AccordionContent>
                  </AccordionItem>
                </FormItem>
              </Accordion>
            </template>
          </AutoFormFieldObject>
        </template>
      </AutoFormFieldArray>
    </template>
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
        :disabled="disabled || !form.values.assignment?.asmType"
        :items="detailOptions"
      />
    </template>
  </AutoForm>
</template>
