<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'

import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import type { LeaveTypeList } from '@/composables/settings/useLeaveType'
import { useLeaveType } from '@/composables/settings/useLeaveType'
import { useListFilter } from '@/composables/useListFilter'
import TablePageLayout from '@/layouts/TablePageLayout.vue'

const { listQuery, deleteQuery, exportFile, importFile, isExporting } = useLeaveType()

const { filterOptions, filterStorage } = useListFilter('leave-type')
const { data, isFetching, isRefetching, refetch } = listQuery(filterOptions)
const { mutate: deleteHoliday, isPending: isDeleting } = deleteQuery()
const { mutate, isPending } = importFile

const gridOptions: GridOptions<LeaveTypeList> = {
  suppressCellFocus: true,
  getRowId: params => params.data.ltId,
  context: {
    onDelete: ({ ltId }: LeaveTypeList) => deleteHoliday(ltId),
  },
}

const columnDefs: Array<ColDef> = [
  { field: 'ltId', headerName: 'ID' },
  { field: 'ltName', headerName: 'Name' },
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
