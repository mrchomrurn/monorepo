<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'

import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import type { Branch } from '@/composables/settings/useBranch'
import { useBranch } from '@/composables/settings/useBranch'
import { useListFilter } from '@/composables/useListFilter'
import TablePageLayout from '@/layouts/TablePageLayout.vue'

const { listQuery, deleteQuery, exportFile, importFile, isExporting } = useBranch()
const { mutate, isPending } = importFile

const { filterOptions, filterStorage } = useListFilter('organization-branch')
const { data, isFetching, isRefetching, refetch } = listQuery(filterOptions)
const { mutate: deleteBranch, isPending: isDeleting } = deleteQuery()

const gridOptions: GridOptions<Branch> = {
  suppressCellFocus: true,
  getRowId: params => params.data.branchId,
  context: {
    onDelete: ({ branchId }: Branch) => deleteBranch(branchId),
  },
}

const columnDefs: Array<ColDef> = [
  { field: 'branchId', headerName: 'ID' },
  { field: 'branchName', headerName: 'Name' },
  { field: 'branchShortKey', headerName: 'Short Key' },
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
