<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'

import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import type { Language } from '@/composables/settings/useLanguage'
import { useLanguage } from '@/composables/settings/useLanguage'
import { useListFilter } from '@/composables/useListFilter'
import TablePageLayout from '@/layouts/TablePageLayout.vue'

const { listQuery, deleteQuery, importFile, exportFile, isExporting } = useLanguage()
const { mutate, isPending } = importFile

const { filterOptions, filterStorage } = useListFilter('employee-language')
const { data, isFetching, isRefetching, refetch } = listQuery(filterOptions)
const { mutate: deleteLanguage, isPending: isDeleting } = deleteQuery()

const gridOptions: GridOptions<Language> = {
  suppressCellFocus: true,
  getRowId: params => params.data.lanId,
  context: {
    onDelete: ({ lanId }: Language) => deleteLanguage(lanId),
  },
}

const columnDefs: Array<ColDef> = [
  { field: 'lanId', headerName: 'ID' },
  { field: 'lanName', headerName: 'Name' },
  { field: 'lanDes', headerName: 'Description' },
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
