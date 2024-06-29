<script setup lang="ts">
import { ref } from 'vue'
import { Download, EllipsisVertical, FileSpreadsheet, Loader, LoaderCircle, Upload } from 'lucide-vue-next'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

defineProps<{
  isImporting?: boolean
  isExporting?: boolean
}>()

defineEmits<{
  export: []
  import: [file: File]
}>()

const open = ref()
const file = ref<File>()

const handleInputChange = (e: Event) => {
  const { files } = e.target as HTMLInputElement
  file.value = files?.[0]
}
</script>

<template>
  <Dialog v-model:open="open" @update:open="file = undefined">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="outline"
          size="icon"
          :disabled="isExporting"
        >
          <Loader
            v-if="isExporting"
            :size="20"
            class="animate-spin"
          />
          <EllipsisVertical v-else :size="20" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DialogTrigger as-child>
          <DropdownMenuItem class="gap-1.5">
            <FileSpreadsheet :size="16" />
            <p>{{ $t('actions.import') }}</p>
          </DropdownMenuItem>
        </DialogTrigger>
        <DropdownMenuItem class="gap-1.5" @select="$emit('export')">
          <Download :size="16" />
          <p>{{ $t('actions.export') }}</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ $t('actions.importFile') }}</DialogTitle>
        <DialogDescription class="sr-only">
          Excel file
        </DialogDescription>
      </DialogHeader>
      <Input
        type="file"
        class="cursor-pointer"
        :disabled="isImporting"
        @change="handleInputChange"
      />
      <DialogFooter class="items-center ">
        <DialogClose as-child>
          <Button
            type="button"
            variant="outline"
            :disabled="isImporting"
          >
            {{ $t('actions.cancel') }}
          </Button>
          <Button
            type="button"
            :disabled="!file?.name || isImporting"
            @click="$emit('import', file as File)"
          >
            {{ $t('actions.upload') }}
            <LoaderCircle
              v-if="isImporting"
              class="ml-2 animate-spin"
              :size="16"
            />
            <Upload
              v-else
              class="ml-2"
              :size="16"
            />
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
