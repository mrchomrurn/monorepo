<script setup lang="ts">
import EmployeeTypeForm from './EmployeeTypeForm.vue'
</script>

<template>
  <EmployeeTypeForm :id="$route.query.id?.toString() || ''" type="create" />
</template>
