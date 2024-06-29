<script setup lang="ts">
import EmployeeCategoryForm from './HolidayForm.vue'
</script>

<template>
  <EmployeeCategoryForm :id="$route.params.id as string || ''" type="show" />
</template>
