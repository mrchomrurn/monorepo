<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'

import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import { useListFilter } from '@/composables/useListFilter'
import TablePageLayout from '@/layouts/TablePageLayout.vue'
import type { EmployeeRace } from '@/composables/settings/useEmployeeRace'
import { useEmployeeRace } from '@/composables/settings/useEmployeeRace'

const { listQuery, deleteQuery, exportFile, importFile, isExporting } = useEmployeeRace()
const { mutate, isPending } = importFile

const { filterOptions, filterStorage } = useListFilter('employee-race')
const { data, isFetching, isRefetching, refetch } = listQuery(filterOptions)
const { mutate: deleteRace, isPending: isDeleting } = deleteQuery()

const gridOptions: GridOptions<EmployeeRace> = {
  suppressCellFocus: true,
  getRowId: params => params.data.raceId,
  context: {
    onDelete: ({ raceId }: EmployeeRace) => deleteRace(raceId),
  },
}

const columnDefs: Array<ColDef> = [
  { field: 'raceId', headerName: 'ID' },
  { field: 'raceName', headerName: 'Name' },
  { field: 'raceDes', headerName: 'Description' },
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
