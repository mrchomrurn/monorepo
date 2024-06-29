<script setup lang="ts">
import EmployeeGradeForm from '@/pages/setting/employee/grade/EmployeeGradeForm.vue'
</script>

<template>
  <EmployeeGradeForm :id="$route.query.id?.toString() || ''" type="create" />
</template>
