<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import Toaster from '@/components/ui/toast/Toaster.vue'
</script>

<template>
  <RouterView />
  <Toaster />
  <VueQueryDevtools />
</template>
