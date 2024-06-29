<script setup lang="ts">
import WorkShiftForm from './WorkShiftForm.vue'
</script>

<template>
  <WorkShiftForm :id="$route.params.id as string || ''" type="show" />
</template>
