<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'

import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import type { Holiday } from '@/composables/settings/useHoliday'
import { useHoliday } from '@/composables/settings/useHoliday'
import { useListFilter } from '@/composables/useListFilter'
import TablePageLayout from '@/layouts/TablePageLayout.vue'

const { listQuery, deleteQuery, exportFile, importFile, isExporting } = useHoliday()

const { filterOptions, filterStorage } = useListFilter('holiday')
const { data, isFetching, isRefetching, refetch } = listQuery(filterOptions)
const { mutate: deleteHoliday, isPending: isDeleting } = deleteQuery()
const { mutate, isPending } = importFile

const gridOptions: GridOptions<Holiday> = {
  suppressCellFocus: true,
  getRowId: params => params.data.phId,
  context: {
    onDelete: ({ phId }: Holiday) => deleteHoliday(phId),
  },
}

const columnDefs: Array<ColDef> = [
  { field: 'phId', headerName: 'ID' },
  { field: 'phName', headerName: 'Name' },
  { field: 'phStartDate', headerName: 'Start Date' },
  { field: 'phEndDate', headerName: 'End Date' },
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
