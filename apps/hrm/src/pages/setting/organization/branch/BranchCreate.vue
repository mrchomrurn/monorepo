<script setup lang="ts">
import BranchForm from './BranchForm.vue'
</script>

<template>
  <BranchForm :id="$route.query.id?.toString() || ''" type="create" />
</template>
