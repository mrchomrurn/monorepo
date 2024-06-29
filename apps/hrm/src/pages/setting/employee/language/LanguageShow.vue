<script setup lang="ts">
import LanguageForm from './LanguageForm.vue'
</script>

<template>
  <LanguageForm :id="$route.params.id?.toString() || ''" type="show" />
</template>
