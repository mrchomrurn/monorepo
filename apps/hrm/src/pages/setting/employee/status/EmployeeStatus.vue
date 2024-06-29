<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'

import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import type { EmployeeStatus } from '@/composables/settings/useEmployeeStatus'
import { useEmployeeStatus } from '@/composables/settings/useEmployeeStatus'
import { useListFilter } from '@/composables/useListFilter'
import TablePageLayout from '@/layouts/TablePageLayout.vue'

const { listQuery, deleteQuery, exportFile, importFile, isExporting } = useEmployeeStatus()
const { mutate, isPending } = importFile

const { filterOptions, filterStorage } = useListFilter('employee-status')
const { data, isFetching, isRefetching, refetch } = listQuery(filterOptions)
const { mutate: deleteStatus, isPending: isDeleting } = deleteQuery()

const gridOptions: GridOptions<EmployeeStatus> = {
  suppressCellFocus: true,
  getRowId: params => params.data.statusId,
  context: {
    onDelete: ({ statusId }: EmployeeStatus) => deleteStatus(statusId),
  },
}

const columnDefs: Array<ColDef> = [
  { field: 'statusId', headerName: 'ID' },
  { field: 'statusName', headerName: 'Name' },
  { field: 'statusDes', headerName: 'Description' },
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
