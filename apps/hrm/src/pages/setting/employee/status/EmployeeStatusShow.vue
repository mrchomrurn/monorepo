<script setup lang="ts">
import EmployeeStatusForm from './EmployeeStatusForm.vue'
</script>

<template>
  <EmployeeStatusForm :id="$route.params.id?.toString() || ''" type="show" />
</template>
