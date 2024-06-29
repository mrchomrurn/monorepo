<script setup lang="ts">
import EmployeeNationalityForm from './EmployeeNationalityForm.vue'
</script>

<template>
  <EmployeeNationalityForm :id="$route.query.id?.toString() || ''" type="create" />
</template>
