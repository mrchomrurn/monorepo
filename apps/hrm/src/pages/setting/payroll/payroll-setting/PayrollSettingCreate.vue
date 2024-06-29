<script setup lang="ts">
import PayrollSettingForm from '@/pages/setting/payroll/payroll-setting/PayrollSettingForm.vue'
</script>

<template>
  <PayrollSettingForm :id="$route.query.id?.toString() || ''" type="create" />
</template>
