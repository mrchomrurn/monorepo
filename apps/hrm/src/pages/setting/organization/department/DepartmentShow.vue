<script setup lang="ts">
import DepartmentForm from './DepartmentForm.vue'
</script>

<template>
  <DepartmentForm :id="$route.params.id?.toString() || ''" type="show" />
</template>
