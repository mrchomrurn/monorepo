<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'

import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import type { WorkShift } from '@/composables/settings/useWorkShift'
import { useWorkShift } from '@/composables/settings/useWorkShift'
import { useListFilter } from '@/composables/useListFilter'
import TablePageLayout from '@/layouts/TablePageLayout.vue'

const { listQuery, deleteQuery, exportFile, importFile, isExporting } = useWorkShift()

const { filterOptions, filterStorage } = useListFilter('work-shift')
const { data, isFetching, isRefetching, refetch } = listQuery(filterOptions)
const { mutate: deleteHoliday, isPending: isDeleting } = deleteQuery()
const { mutate, isPending } = importFile

const gridOptions: GridOptions<WorkShift> = {
  suppressCellFocus: true,
  getRowId: params => params.data.wsId,
  context: {
    onDelete: ({ wsId }: WorkShift) => deleteHoliday(wsId),
  },
}

const columnDefs: Array<ColDef> = [
  { field: 'wsId', headerName: 'ID' },
  { field: 'wsName', headerName: 'Name' },
]
</script>

<template>
  <TablePageLayout>
    <ListHeader
      v-model="filterOptions"
      v-model:filter-storage="filterStorage"
      :loading="isRefetching"
      :is-importing="isPending"
      :is-exporting="isExporting"
      :field-headers="columnDefs"
      @refetch="refetch"
      @export="exportFile"
      @import="mutate"
    />
    <BkGrid
      v-model:filter-options="filterOptions"
      :filter-storage="filterStorage"
      :data="data"
      :column-defs="columnDefs"
      :grid-options="gridOptions"
      :loading="isFetching || isDeleting"
    />
  </TablePageLayout>
</template>
