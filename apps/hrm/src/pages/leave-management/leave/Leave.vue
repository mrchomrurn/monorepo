<script setup lang="ts">
import type { ColDef, GridOptions } from '@ag-grid-community/core'
import { endOfYear, format, startOfYear } from 'date-fns'
import { ref } from 'vue'
import type { Ref } from 'vue'

import { Status, useLeave } from '@/pages/leave-management/leave/useLeave'
import type { Leave, LeaveFilter } from '@/pages/leave-management/leave/useLeave'
import TablePageLayout from '@/layouts/TablePageLayout.vue'
import { useListFilter } from '@/composables/useListFilter'
import ListHeader from '@/components/ListHeader.vue'
import BkGrid from '@/components/BkGrid.vue'
import LeaveTableAction from '@/pages/leave-management/leave/LeaveTableAction.vue'
import LeaveTableFilter from '@/pages/leave-management/leave/LeaveTableFilter.vue'

const { listQuery } = useLeave()

const { filterStorage, filterOptions } = useListFilter('leave')

const leaveFilters = ref<LeaveFilter>({
  startDate: format(startOfYear(new Date()), 'yyyy-MM-dd'),
  endDate: format(endOfYear(new Date()), 'yyyy-MM-dd'),
  status: Status.All,
  ...filterOptions.value,
})

const { data, isFetching, isRefetching, refetch } = listQuery(leaveFilters)

const gridOptions: GridOptions<Leave> = {
  suppressCellFocus: true,
  getRowId: params => params.data.leId,
}

const columnDefs: Array<ColDef> = [
  { field: 'leId', headerName: 'ID' },
  { field: 'leEmpId', headerName: 'Employee ID' },
  { field: 'leEmpName', headerName: 'Employee Name' },
  { field: 'leEmpNameKh', headerName: 'Employee Name Khmer' },
  { field: 'leReason', headerName: 'Reason' },
  { field: 'leStatus', headerName: 'Status' },
  {
    field: 'leCreatedDate',
    headerName: 'Created Date',
    cellRenderer: (params: Ref<string>) => format(new Date(params.value), 'dd MMMM yyyy'),
  },
]
</script>

<template>
  <TablePageLayout>
    <ListHeader
      v-model="leaveFilters"
      v-model:filter-storage="filterStorage"
      :loading="isRefetching"
      :field-headers="columnDefs"
      :show-import-export="false"
      @refetch="refetch"
    >
      <template #filter>
        <LeaveTableFilter v-model="leaveFilters" />
      </template>
    </ListHeader>

    <BkGrid
      v-model:filter-options="leaveFilters"
      :filter-storage="filterStorage"
      :data="data"
      :column-defs="columnDefs"
      :grid-options="gridOptions"
      :loading="isFetching "
      :custom-table-action="LeaveTableAction"
    />
  </TablePageLayout>
</template>
