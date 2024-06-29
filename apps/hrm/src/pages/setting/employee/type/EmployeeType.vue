<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'

import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import type { EmployeeType } from '@/composables/settings/useEmployeeType'
import { useEmployeeType } from '@/composables/settings/useEmployeeType'
import { useListFilter } from '@/composables/useListFilter'
import TablePageLayout from '@/layouts/TablePageLayout.vue'

const { listQuery, deleteQuery, exportFile, importFile, isExporting } = useEmployeeType()

const { filterOptions, filterStorage } = useListFilter('employee-type')
const { data, isFetching, isRefetching, refetch } = listQuery(filterOptions)
const { mutate: deleteType, isPending: isDeleting } = deleteQuery()
const { mutate, isPending } = importFile

const gridOptions: GridOptions<EmployeeType> = {
  suppressCellFocus: true,
  getRowId: params => params.data.typeId,
  context: {
    onDelete: ({ typeId }: EmployeeType) => deleteType(typeId),
  },
}

const columnDefs: Array<ColDef> = [
  { field: 'typeId', headerName: 'ID' },
  { field: 'typeName', headerName: 'Name' },
  { field: 'typeDes', headerName: 'Description' },
]
</script>

<template>
  <TablePageLayout>
    <ListHeader
      v-model="filterOptions"
      v-model:filter-storage="filterStorage"
      :field-headers="columnDefs"
      :loading="isRefetching"
      :is-importing="isPending"
      :is-exporting="isExporting"
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
