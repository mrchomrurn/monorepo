<script setup lang="ts">
import EmployeePositionForm from './EmployeePositionForm.vue'
</script>

<template>
  <EmployeePositionForm :id="$route.query.id?.toString() || ''" type="create" />
</template>
