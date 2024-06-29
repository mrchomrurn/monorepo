<script setup lang="ts">
import ContractTypeForm from './ContractTypeForm.vue'
</script>

<template>
  <ContractTypeForm :id="$route.params.id as string || ''" type="show" />
</template>
