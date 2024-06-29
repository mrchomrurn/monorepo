<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'

import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import type { EmployeeCategory } from '@/composables/settings/useEmployeeCategory'
import { useEmployeeCategory } from '@/composables/settings/useEmployeeCategory'
import { useListFilter } from '@/composables/useListFilter'
import TablePageLayout from '@/layouts/TablePageLayout.vue'

const { listQuery, deleteQuery, exportFile, importFile, isExporting } = useEmployeeCategory()
const { mutate, isPending } = importFile

const { filterOptions, filterStorage } = useListFilter('employee-category')
const { data, isFetching, isRefetching, refetch } = listQuery(filterOptions)
const { mutate: deleteCategory, isPending: isDeleting } = deleteQuery()

const gridOptions: GridOptions<EmployeeCategory> = {
  suppressCellFocus: true,
  getRowId: params => params.data.cateId,
  context: {
    onDelete: ({ cateId }: EmployeeCategory) => deleteCategory(cateId),
  },
}

const columnDefs: Array<ColDef> = [
  { field: 'cateId', headerName: 'Category Id' },
  { field: 'cateName', headerName: 'Category Name' },
  { field: 'cateDes', headerName: 'Category Description' },
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
