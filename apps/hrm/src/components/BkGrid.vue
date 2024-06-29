<script setup lang="ts" generic="T">
import type { Component } from 'vue'
import { computed, ref, watch, watchEffect } from 'vue'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { AgGridVue } from '@ag-grid-community/vue3'
import type { ColDef, GridApi, GridOptions, GridReadyEvent } from '@ag-grid-community/core'
import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-quartz.css'

import { useDark } from '@vueuse/core'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import TableLoading from './TableLoading.vue'
import TableAction from './TableAction.vue'
import Button from '@/components/ui/button/Button.vue'
import type { FilterOptions } from '@/lib/constants'
import type { ListData } from '@/types/ApiResponse'
import Select from '@/components/ui/select/Select.vue'
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue'
import SelectValue from '@/components/ui/select/SelectValue.vue'
import SelectContent from '@/components/ui/select/SelectContent.vue'
import SelectItem from '@/components/ui/select/SelectItem.vue'
import type { FilterStorage } from '@/composables/useListFilter'

interface Props {
  data: ListData<T> | undefined
  columnDefs: Array<ColDef>
  gridOptions?: GridOptions
  loading?: boolean
  hasActions?: boolean
  filterStorage?: FilterStorage
  customTableAction?: Component
}

const props = withDefaults(defineProps<Props>(), {
  hasActions: true,
})

const isDark = useDark()

const gridApi = ref<GridApi>()

const columnDefs = computed(() => {
  if (!props.hasActions) return props.columnDefs
  const actionsDef: ColDef = {
    pinned: 'left',
    field: 'action',
    headerName: 'Action',
    lockPinned: true,
    sortable: false,
    filter: false,
    editable: false,
    resizable: false,
    width: 100,
    headerClass: 'cell-center', // align header center
    cellRenderer: props.customTableAction || TableAction,
  }

  return [actionsDef, ...props.columnDefs]
})

const onGridReady = (params: GridReadyEvent) => {
  gridApi.value = params.api
}

const defaultColDef: ColDef = {
  flex: 1,
}

const filterModel = defineModel<FilterOptions>('filterOptions', { default: {} })
const currentPage = computed(() => filterModel.value.page! + 1)
const currentTotalPage = ref<number>(1)

const handlePreviousPage = () => {
  if (filterModel.value.page === 0) return
  filterModel.value.page--
}

const handleNextPage = () => {
  if (filterModel.value.page === currentTotalPage.value - 1) return
  filterModel.value.page++
}

const handlePageChange = (page: string) => {
  filterModel.value.page = Number(page) - 1
}

watch(() => props.loading, (value) => {
  if (value)
    gridApi.value?.showLoadingOverlay()
  else
    gridApi.value?.hideOverlay()
})

watch(() => props.data?.totalPage, (value) => {
  if (!value) return
  currentTotalPage.value = value
})

watchEffect(() => {
  gridApi.value?.applyColumnState({
    state: props.filterStorage?.headerToHide?.map(field => ({ colId: field, hide: true })),
    defaultState: { hide: null },
  })
})
</script>

<template>
  <section class="flex items-center justify-end gap-2">
    <Button
      variant="outline"
      class="size-8 p-0"
      :disabled="filterModel.page === 0"
      @click="handlePreviousPage"
    >
      <ChevronLeft class="size-4" />
    </Button>
    <Select
      :model-value="`${currentPage}`"
      @update:model-value="handlePageChange"
    >
      <SelectTrigger class="h-8 w-16">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="pageSize in currentTotalPage"
          :key="pageSize"
          :value="pageSize.toString()"
        >
          {{ pageSize }}
        </SelectItem>
      </SelectContent>
    </Select>
    <Button
      variant="outline"
      class="size-8 p-0"
      :disabled="filterModel.page === currentTotalPage - 1"
      @click="handleNextPage"
    >
      <ChevronRight class="size-4" />
    </Button>
  </section>

  <AgGridVue
    :class="[isDark ? 'ag-theme-quartz-dark' : 'ag-theme-quartz']"
    :modules="[ClientSideRowModelModule]"
    :loading-overlay-component="TableLoading"
    :grid-options
    :row-data="data?.list"
    :column-defs
    :default-col-def
    :pagination="true"
    :suppress-pagination-panel="true"
    :suppress-scroll-on-new-data="true"
    style="height: 100%"
    @grid-ready="onGridReady"
  />
</template>

<style scoped>
.ag-theme-quartz {
   /* Add left and right borders to each cell and use row border's properties  */
  --ag-cell-horizontal-border: var(--ag-row-border-width)
    var(--ag-row-border-style) var(--ag-row-border-color);
  --ag-header-column-separator-display: block;
}

:deep(.cell-center .ag-header-cell-label){
  justify-content: center;
}
</style>
