<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'

import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import { useListFilter } from '@/composables/useListFilter'
import TablePageLayout from '@/layouts/TablePageLayout.vue'
import type { EmployeeNationality } from '@/composables/settings/useEmployeeNationality'
import { useEmployeeNationality } from '@/composables/settings/useEmployeeNationality'

const { listQuery, deleteQuery, exportFile, importFile, isExporting } = useEmployeeNationality()
const { mutate, isPending } = importFile

const { filterOptions, filterStorage } = useListFilter('employee-nationality')
const { data, isFetching, isRefetching, refetch } = listQuery(filterOptions)
const { mutate: deleteNationality, isPending: isDeleting } = deleteQuery()

const gridOptions: GridOptions<EmployeeNationality> = {
  suppressCellFocus: true,
  getRowId: params => params.data.natId,
  context: {
    onDelete: ({ natId }: EmployeeNationality) => deleteNationality(natId),
  },
}

const columnDefs: Array<ColDef> = [
  { field: 'natId', headerName: 'ID' },
  { field: 'natName', headerName: 'Name' },
  { field: 'natDes', headerName: 'Description' },
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
