<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'

import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import type { EmployeeGrade } from '@/composables/settings/useEmployeeGrade'
import { useEmployeeGrade } from '@/composables/settings/useEmployeeGrade'
import { useListFilter } from '@/composables/useListFilter'
import TablePageLayout from '@/layouts/TablePageLayout.vue'

const { listQuery, deleteQuery, exportFile, importFile, isExporting } = useEmployeeGrade()

const { filterOptions, filterStorage } = useListFilter('employee-grade')
const { data, isFetching, isRefetching, refetch } = listQuery(filterOptions)
const { mutate: deleteType, isPending: isDeleting } = deleteQuery()
const { mutate, isPending } = importFile

const gridOptions: GridOptions<EmployeeGrade> = {
  suppressCellFocus: true,
  getRowId: params => params.data.gradeId,
  context: {
    onDelete: ({ gradeId }: EmployeeGrade) => deleteType(gradeId),
  },
}

const columnDefs: Array<ColDef> = [
  { field: 'gradeId', headerName: 'ID' },
  { field: 'gradeName', headerName: 'Name' },
  { field: 'gradeDes', headerName: 'Description' },
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
