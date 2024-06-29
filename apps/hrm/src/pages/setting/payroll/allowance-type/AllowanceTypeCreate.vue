<script setup lang="ts">
import AllowanceTypeForm from '@/pages/setting/payroll/allowance-type/AllowanceTypeForm.vue'
</script>

<template>
  <AllowanceTypeForm :id="$route.query.id?.toString() || ''" type="create" />
</template>
