<script setup lang="ts">
import BankForm from './BankForm.vue'
</script>

<template>
  <BankForm :id="$route.params.id?.toString() || ''" type="show" />
</template>
