<script setup lang="ts">
import EmployeeStatusForm from './EmployeeStatusForm.vue'
</script>

<template>
  <EmployeeStatusForm :id="$route.query.id?.toString() || ''" type="create" />
</template>
