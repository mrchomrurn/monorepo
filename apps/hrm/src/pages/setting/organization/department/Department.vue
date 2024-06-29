<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'

import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import type { Department } from '@/composables/settings/useDepartment'
import { useDepartment } from '@/composables/settings/useDepartment'
import { useListFilter } from '@/composables/useListFilter'
import TablePageLayout from '@/layouts/TablePageLayout.vue'

const { listQuery, deleteQuery, exportFile, importFile, isExporting } = useDepartment()
const { mutate, isPending } = importFile

const { filterOptions, filterStorage } = useListFilter('organization-department')
const { data, isFetching, isRefetching, refetch } = listQuery(filterOptions)
const { mutate: deleteDepartment, isPending: isDeleting } = deleteQuery()

const gridOptions: GridOptions<Department> = {
  suppressCellFocus: true,
  getRowId: params => params.data.depId,
  context: {
    onDelete: ({ depId }: Department) => deleteDepartment(depId),
  },
}

const columnDefs: Array<ColDef> = [
  { field: 'depId', headerName: 'ID' },
  { field: 'depName', headerName: 'Name' },
  { field: 'depDes', headerName: 'Description' },
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
