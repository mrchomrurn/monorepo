<script setup lang="ts">
import WorkShiftForm from './WorkShiftForm.vue'
</script>

<template>
  <WorkShiftForm :id="$route.query.id?.toString() || ''" type="create" />
</template>
