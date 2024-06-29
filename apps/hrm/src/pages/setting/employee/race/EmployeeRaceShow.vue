<script setup lang="ts">
import EmployeeRaceForm from './EmployeeRaceForm.vue'
</script>

<template>
  <EmployeeRaceForm :id="$route.params.id as string || ''" type="show" />
</template>
