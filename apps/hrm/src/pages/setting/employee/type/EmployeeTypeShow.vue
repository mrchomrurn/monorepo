<script setup lang="ts">
import EmployeeTypeForm from './EmployeeTypeForm.vue'
</script>

<template>
  <EmployeeTypeForm :id="$route.params.id?.toString() || ''" type="show" />
</template>
