<script setup lang="ts">
import LanguageForm from './LanguageForm.vue'
</script>

<template>
  <LanguageForm :id="$route.query.id?.toString() || ''" type="create" />
</template>
