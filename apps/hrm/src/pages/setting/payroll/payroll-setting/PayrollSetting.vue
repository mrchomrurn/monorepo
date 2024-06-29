<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'

import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import type { Payroll } from '@/composables/settings/usePayroll'
import { usePayroll } from '@/composables/settings/usePayroll'
import { useListFilter } from '@/composables/useListFilter'
import TablePageLayout from '@/layouts/TablePageLayout.vue'

const { listQuery, deleteQuery, exportFile, importFile, isExporting } = usePayroll()

const { filterOptions, filterStorage } = useListFilter('payroll-setting')
const { data, isFetching, isRefetching, refetch } = listQuery(filterOptions)
const { mutate: deleteHoliday, isPending: isDeleting } = deleteQuery()
const { mutate, isPending } = importFile

const gridOptions: GridOptions<Payroll> = {
  suppressCellFocus: true,
  getRowId: params => params.data.psId,
  context: {
    onDelete: ({ psId }: Payroll) => deleteHoliday(psId),
  },
}

const columnDefs: Array<ColDef> = [
  { field: 'psId', headerName: 'ID' },
  { field: 'psName', headerName: 'Name' },
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
      :column-defs="columnDefs"
      :grid-options="gridOptions"
      :loading="isFetching || isDeleting"
    />
  </TablePageLayout>
</template>
