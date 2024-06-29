<script lang="ts" setup>
import { watch } from 'vue'

import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { FormType, SaveAction } from '@/types/Action'
import { useFormAction } from '@/composables/useFormAction'
import { useTabStore } from '@/store/tab'
import type { SocialMediaContactSchema } from '@/composables/settings/useSocialMediaContact'
import { schema, useSocialMediaContact } from '@/composables/settings/useSocialMediaContact'
import AutoForm from '@/components/ui/auto-form/AutoForm.vue'

const props = defineProps<{
  id: string
  type: FormType
}>()

const { closeCurrentTab } = useTabStore()
const { handleSaveAction } = useFormAction()
const { getByIdQuery, createMutation, deleteQuery, editMutation } = useSocialMediaContact()

const { mutate: createSmc, isPending: isCreating } = createMutation()
const { mutate: deleteSmc, isPending: isDeleting } = deleteQuery()
const { mutate: editSmc, isPending: isEditing } = editMutation()

const { data, isLoading } = getByIdQuery((props.id))
const form = useForm<SocialMediaContactSchema>({
  validationSchema: toTypedSchema(schema),
  initialValues: data.value,
})

watch(data, values => form.resetForm({ values }), { once: true })

const onSubmit = (formValues: SocialMediaContactSchema, saveAction: SaveAction) => {
  if (props.type === 'edit') {
    editSmc({ body: formValues, id: props.id }, { onSuccess: () => handleSaveAction(saveAction, props.id) })
    return
  }

  createSmc(formValues, {
    onSuccess: (res) => {
      handleSaveAction(saveAction, res.data.id)
      if (props.type === 'duplicate') return
      form.resetForm({ values: {} }, { force: true })
    },
  })
}

const onDelete = async () => deleteSmc(props.id, { onSuccess: closeCurrentTab })
</script>

<template>
  <AutoForm
    :id="id"
    :type="type"
    :schema="schema"
    :form="form"
    :disabled="type === 'show'"
    :field-config="{ smcDes: { component: 'textarea' } }"
    :loading="isLoading || isCreating || isEditing || isDeleting"
    @submit="onSubmit"
    @delete="onDelete"
  />
</template>
