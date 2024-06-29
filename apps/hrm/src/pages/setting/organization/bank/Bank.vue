<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'

import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import type { Bank } from '@/composables/settings/useBank'
import { useBank } from '@/composables/settings/useBank'
import { useListFilter } from '@/composables/useListFilter'
import TablePageLayout from '@/layouts/TablePageLayout.vue'

const { listQuery, deleteQuery, exportFile, importFile, isExporting } = useBank()
const { mutate, isPending } = importFile

const { filterOptions, filterStorage } = useListFilter('organization-bank')
const { data, isFetching, isRefetching, refetch } = listQuery(filterOptions)
const { mutate: deleteBank, isPending: isDeleting } = deleteQuery()

const gridOptions: GridOptions<Bank> = {
  suppressCellFocus: true,
  getRowId: params => params.data.bankId,
  context: {
    onDelete: ({ bankId }: Bank) => deleteBank(bankId),
  },
}

const columnDefs: Array<ColDef> = [
  { field: 'bankId', headerName: 'ID' },
  { field: 'bankName', headerName: 'Name' },
  { field: 'bankDes', headerName: 'Description' },
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
