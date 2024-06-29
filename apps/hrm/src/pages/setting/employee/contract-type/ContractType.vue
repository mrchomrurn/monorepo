<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'

import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import { useListFilter } from '@/composables/useListFilter'
import TablePageLayout from '@/layouts/TablePageLayout.vue'
import type { ContractType } from '@/composables/settings/useContractType'
import { useContractType } from '@/composables/settings/useContractType'

const { listQuery, deleteQuery, exportFile, importFile, isExporting } = useContractType()
const { mutate, isPending } = importFile

const { filterOptions, filterStorage } = useListFilter('employee-contract-type')
const { data, isFetching, isRefetching, refetch } = listQuery(filterOptions)
const { mutate: deleteContractType, isPending: isDeleting } = deleteQuery()

const gridOptions: GridOptions<ContractType> = {
  suppressCellFocus: true,
  getRowId: params => params.data.ctId,
  context: {
    onDelete: ({ ctId }: ContractType) => deleteContractType(ctId),
  },
}

const columnDefs: Array<ColDef> = [
  { field: 'ctId', headerName: 'ID' },
  { field: 'ctName', headerName: 'Name' },
  { field: 'ctDes', headerName: 'Description' },
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
