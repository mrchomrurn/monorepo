<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Filter, Plus, RefreshCcw } from 'lucide-vue-next'

import type { ColDef } from '@ag-grid-community/core'
import ImportExport from './list-header/ImportExport.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Popover from '@/components/ui/popover/Popover.vue'
import PopoverTrigger from '@/components/ui/popover/PopoverTrigger.vue'
import PopoverContent from '@/components/ui/popover/PopoverContent.vue'
import Select from '@/components/ui/select/Select.vue'
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue'
import SelectValue from '@/components/ui/select/SelectValue.vue'
import SelectContent from '@/components/ui/select/SelectContent.vue'
import SelectGroup from '@/components/ui/select/SelectGroup.vue'
import SelectItem from '@/components/ui/select/SelectItem.vue'
import Label from '@/components/ui/label/Label.vue'
import type { FilterOptions } from '@/lib/constants'
import type { FilterStorage } from '@/composables/useListFilter'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface Props {
  loading?: boolean
  isImporting?: boolean
  isExporting?: boolean
  fieldHeaders?: Array<ColDef>
  showImportExport?: boolean
}

withDefaults(defineProps<Props>(), {
  showImportExport: true,
})

defineEmits<{
  import: [file: File]
  refetch: []
  export: []
}>()

const route = useRoute()

const filterModel = defineModel<FilterOptions>({ required: true })
const filterStorageModel = defineModel<FilterStorage>('filterStorage', { required: true })

const createPageRoute = computed(() => route.meta.moduleName ? `${route.meta.moduleName}-create` : 'dashboard')

const debounce = useDebounceFn((event: Event) => {
  const { value } = event.target as HTMLInputElement
  filterModel.value.search = value
})

const handlePageSizeChange = (size: string) => {
  filterStorageModel.value.size = filterModel.value.size = Number(size)
  filterModel.value.page = 0
}

const pluralize = (count: number, noun: string, suffix = 's') =>
  `${count} ${noun}${count !== 1 ? suffix : ''}`

const handleItemChecked = (value: boolean, field: string) => {
  if (value)
    filterStorageModel.value.headerToHide = filterStorageModel.value.headerToHide.concat(field)
  else
    filterStorageModel.value.headerToHide = filterStorageModel.value.headerToHide.filter(f => f !== field)
}
</script>

<template>
  <div class="flex items-center gap-2 [&>:not(input)]:shrink-0">
    <Button
      as-child
      variant="outline"
      size="icon"
    >
      <RouterLink :to="{ name: createPageRoute }">
        <Plus />
      </RouterLink>
    </Button>

    <Button
      size="icon"
      variant="outline"
      :disabled="loading"
      @click="$emit('refetch')"
    >
      <RefreshCcw :class="loading && 'animate-spin'" :size="20" />
    </Button>

    <Input
      placeholder="Search"
      @input="debounce"
    />

    <Popover>
      <PopoverTrigger as-child>
        <Button size="icon" variant="outline">
          <Filter :size="20" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" class="w-80">
        <div class="grid gap-4">
          <div class="space-y-1">
            <h4 class="font-medium leading-none">
              Filter
            </h4>
            <p class="text-sm text-muted-foreground">
              Set filter options for the table.
            </p>
          </div>

          <div class="space-y-1">
            <Label>Page Size</Label>
            <Select :model-value="filterStorageModel.size?.toString()" @update:model-value="handlePageSizeChange">
              <SelectTrigger>
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="size in ['25', '50', '75', '100']"
                    :key="size"
                    :value="size"
                  >
                    {{ size }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div class="grid gap-1 space-y-1">
            <Label>Hide Headers</Label>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline" class="justify-start px-3 font-normal hover:bg-transparent">
                  <span v-if="filterStorageModel.headerToHide.length">{{ pluralize(filterStorageModel.headerToHide.length, 'Header') }}</span>
                  <span v-else>None</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-[--radix-dropdown-menu-trigger-width]">
                <DropdownMenuCheckboxItem
                  v-for="item in fieldHeaders"
                  :key="item.field"
                  :checked="filterStorageModel.headerToHide.includes(item.field!)"
                  @select="e => e.preventDefault()"
                  @update:checked="handleItemChecked($event, item.field!)"
                >
                  {{ item.headerName }}
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <slot name="filter" />
        </div>
      </PopoverContent>
    </Popover>

    <ImportExport
      v-if="showImportExport"
      :is-importing
      :is-exporting
      @export="$emit('export')"
      @import="$emit('import', $event)"
    />
  </div>
</template>
