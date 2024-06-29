<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'

import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import type { SocialMediaContact } from '@/composables/settings/useSocialMediaContact'
import { useSocialMediaContact } from '@/composables/settings/useSocialMediaContact'
import { useListFilter } from '@/composables/useListFilter'
import TablePageLayout from '@/layouts/TablePageLayout.vue'

const { listQuery, deleteQuery, exportFile, importFile, isExporting } = useSocialMediaContact()
const { mutate, isPending } = importFile

const { filterOptions, filterStorage } = useListFilter('employee-social-media-contact')
const { data, isFetching, isRefetching, refetch } = listQuery(filterOptions)
const { mutate: deleteSmc, isPending: isDeleting } = deleteQuery()

const gridOptions: GridOptions<SocialMediaContact> = {
  suppressCellFocus: true,
  getRowId: params => params.data.smcId,
  context: {
    onDelete: ({ smcId }: SocialMediaContact) => deleteSmc(smcId),
  },
}

const columnDefs: Array<ColDef> = [
  { field: 'smcId', headerName: 'Id' },
  { field: 'smcName', headerName: 'Name' },
  { field: 'smcDes', headerName: 'Description' },
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
