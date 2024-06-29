<script setup lang="ts">
import BranchForm from './BranchForm.vue'
</script>

<template>
  <BranchForm :id="$route.params.id?.toString() || ''" type="show" />
</template>
