<script setup lang="ts">
import MaritalStatusForm from './MaritalStatusForm.vue'
</script>

<template>
  <MaritalStatusForm :id="$route.params.id as string || ''" type="show" />
</template>
