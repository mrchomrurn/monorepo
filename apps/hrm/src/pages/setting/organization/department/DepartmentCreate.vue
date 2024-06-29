<script setup lang="ts">
import DepartmentForm from './DepartmentForm.vue'
</script>

<template>
  <DepartmentForm :id="$route.query.id?.toString() || ''" type="create" />
</template>
