<script setup lang="ts">
import EmployeeCategoryForm from './HolidayForm.vue'
</script>

<template>
  <EmployeeCategoryForm :id="$route.query.id?.toString() || ''" type="create" />
</template>
