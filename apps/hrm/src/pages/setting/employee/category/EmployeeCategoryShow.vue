<script setup lang="ts">
import EmployeeCategoryForm from './EmployeeCategoryForm.vue'
</script>

<template>
  <EmployeeCategoryForm :id="$route.params.id as string || ''" type="show" />
</template>
