<script setup lang="ts">
import MaritalStatusForm from './MaritalStatusForm.vue'
</script>

<template>
  <MaritalStatusForm :id="$route.query.id?.toString() || ''" type="create" />
</template>
