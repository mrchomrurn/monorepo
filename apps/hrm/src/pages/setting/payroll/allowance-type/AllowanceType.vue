<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'

import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import type { AllowanceTypeList } from '@/composables/settings/useAllowanceType'
import { useAllowanceType } from '@/composables/settings/useAllowanceType'
import { useListFilter } from '@/composables/useListFilter'
import TablePageLayout from '@/layouts/TablePageLayout.vue'

const { listQuery, deleteQuery, exportFile, importFile, isExporting } = useAllowanceType()

const { filterOptions, filterStorage } = useListFilter('allowance-type')
const { data, isFetching, isRefetching, refetch } = listQuery(filterOptions)
const { mutate: deleteHoliday, isPending: isDeleting } = deleteQuery()
const { mutate, isPending } = importFile

const gridOptions: GridOptions<AllowanceTypeList> = {
  suppressCellFocus: true,
  getRowId: params => params.data.alwtId,
  context: {
    onDelete: ({ alwtId }: AllowanceTypeList) => deleteHoliday(alwtId),
  },
}

const columnDefs: Array<ColDef> = [
  { field: 'alwtId', headerName: 'ID' },
  { field: 'alwtName', headerName: 'Name' },
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
      :data="data"
      :filter-storage="filterStorage"
      :column-defs="columnDefs"
      :grid-options="gridOptions"
      :loading="isFetching || isDeleting"
    />
  </TablePageLayout>
</template>
