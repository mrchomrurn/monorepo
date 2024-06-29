<script setup lang="ts">
import EmployeePositionForm from './EmployeePositionForm.vue'
</script>

<template>
  <EmployeePositionForm :id="$route.params.id?.toString() || ''" type="show" />
</template>
