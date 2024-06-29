<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'

import type { EmployeePosition } from '@/composables/settings/useEmployeePosition'
import { useEmployeePosition } from '@/composables/settings/useEmployeePosition'
import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import { useListFilter } from '@/composables/useListFilter'
import TablePageLayout from '@/layouts/TablePageLayout.vue'

const { listQuery, deleteQuery, importFile, exportFile, isExporting } = useEmployeePosition()
const { mutate, isPending } = importFile

const { filterOptions, filterStorage } = useListFilter('employee-position')
const { data, isFetching, isRefetching, refetch } = listQuery(filterOptions)
const { mutate: deletePosition, isPending: isDeleting } = deleteQuery()

const gridOptions: GridOptions<EmployeePosition> = {
  suppressCellFocus: true,
  getRowId: params => params.data.posId,
  context: {
    onDelete: ({ posId }: EmployeePosition) => deletePosition(posId),
  },
}

const columnDefs: Array<ColDef> = [
  { field: 'posId', headerName: 'ID' },
  { field: 'posName', headerName: 'Name' },
]
</script>

<template>
  <TablePageLayout>
    <ListHeader
      v-model="filterOptions"
      v-model:filter-storage="filterStorage"
      :field-headers="columnDefs"
      :loading="isRefetching"
      :is-exporting="isExporting"
      :is-importing="isPending"
      @refetch="refetch"
      @export="exportFile"
      @import="mutate"
    />
    <BkGrid
      v-model:filter-options="filterOptions"
      :filter-storage="filterStorage"
      :data="data"
      :column-defs
      :grid-options
      :loading="isFetching || isDeleting"
    />
  </TablePageLayout>
</template>
