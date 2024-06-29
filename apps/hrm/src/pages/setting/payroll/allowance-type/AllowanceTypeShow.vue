<script setup lang="ts">
import AllowanceTypeForm from '@/pages/setting/payroll/allowance-type/AllowanceTypeForm.vue'
</script>

<template>
  <AllowanceTypeForm :id="$route.params.id as string || ''" type="show" />
</template>
