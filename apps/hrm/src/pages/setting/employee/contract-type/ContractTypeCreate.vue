<script setup lang="ts">
import ContractTypeForm from './ContractTypeForm.vue'
</script>

<template>
  <ContractTypeForm :id="$route.query.id?.toString() || ''" type="create" />
</template>
