<script setup lang="ts">
import EmployeeRaceForm from './EmployeeRaceForm.vue'
</script>

<template>
  <EmployeeRaceForm :id="$route.query.id?.toString() || ''" type="create" />
</template>
