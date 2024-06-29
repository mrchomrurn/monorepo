<script setup lang="ts">
import EmployeeNationalityForm from './EmployeeNationalityForm.vue'
</script>

<template>
  <EmployeeNationalityForm :id="$route.params.id as string || ''" type="show" />
</template>
