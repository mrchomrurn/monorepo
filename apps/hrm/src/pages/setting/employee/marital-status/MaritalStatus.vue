<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'

import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import { useListFilter } from '@/composables/useListFilter'
import TablePageLayout from '@/layouts/TablePageLayout.vue'
import type { MaritalStatus } from '@/composables/settings/useMaritalStatus'
import { useMaritalStatus } from '@/composables/settings/useMaritalStatus'

const { listQuery, deleteQuery, exportFile, importFile, isExporting } = useMaritalStatus()
const { mutate, isPending } = importFile

const { filterOptions, filterStorage } = useListFilter('employee-nationality')
const { data, isFetching, isRefetching, refetch } = listQuery(filterOptions)
const { mutate: deleteMaritalStatus, isPending: isDeleting } = deleteQuery()

const gridOptions: GridOptions<MaritalStatus> = {
  suppressCellFocus: true,
  getRowId: params => params.data.msId,
  context: {
    onDelete: ({ msId }: MaritalStatus) => deleteMaritalStatus(msId),
  },
}

const columnDefs: Array<ColDef> = [
  { field: 'msId', headerName: 'ID' },
  { field: 'msName', headerName: 'Name' },
  { field: 'msDes', headerName: 'Description' },
]
</script>

<template>
  <TablePageLayout>
    <ListHeader
      v-model="filterOptions"
      v-model:filter-storage="filterStorage"
      :loading="isRefetching"
      :is-exporting="isExporting"
      :is-importing="isPending"
      :field-headers="columnDefs"
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
