<script setup lang="ts">
import SocialMediaContactForm from './SocialMediaContactForm.vue'
</script>

<template>
  <SocialMediaContactForm :id="$route.params.id?.toString() || ''" type="show" />
</template>
