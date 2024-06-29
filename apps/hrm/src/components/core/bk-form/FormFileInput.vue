<script setup lang="ts">
import { useField } from 'vee-validate'
import { Loader, Paperclip } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Dialog from '@/components/ui/dialog/Dialog.vue'
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { FileAttachment } from '@/composables/useFileUpload'
import { useFileUpload } from '@/composables/useFileUpload'

interface Props {
  name: string
  label: string
  multiple?: boolean
  disabled?: boolean
}

const props = defineProps<Props>()

const { mutate: uploadFile, isPending } = useFileUpload()
const { handleChange, value } = useField<FileAttachment[]>(() => props.name)

function onChange(e: Event) {
  const { files } = e.target as HTMLInputElement

  if (!files?.length) {
    handleChange([])
    return
  }

  uploadFile(files, {
    onSuccess: res => handleChange(res),
  })
}
</script>

<template>
  <FormField :name="name">
    <FormItem>
      <FormLabel>{{ label }}</FormLabel>
      <FormControl>
        <div class="flex gap-2">
          <Input
            type="file"
            :multiple="multiple"
            :disabled="disabled"
            @change="onChange"
          />
          <Dialog>
            <DialogTrigger as-child>
              <Button :disabled="!value?.length || isPending" variant="secondary">
                <Loader
                  v-if="isPending"
                  class="animate-spin"
                  :size="18"
                />
                <Paperclip v-else :size="18" />
                <span class="ml-2">Preview</span>
              </Button>
            </DialogTrigger>
            <DialogContent class="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Image</DialogTitle>
                <DialogDescription>
                  Preview your image here.
                </DialogDescription>
              </DialogHeader>
              <div class="grid grid-cols-3 gap-4">
                <div
                  v-for="attachment in value"
                  :key="attachment.fileName"
                  class="h-52 rounded-md border p-2"
                >
                  <img :src="attachment.cdn" class="m-auto h-full object-cover">
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
