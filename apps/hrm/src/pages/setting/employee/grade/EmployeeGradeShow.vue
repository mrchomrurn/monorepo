<script setup lang="ts">
import EmployeeGradeForm from './EmployeeGradeForm.vue'
</script>

<template>
  <EmployeeGradeForm :id="$route.params.id?.toString() || ''" type="show" />
</template>
