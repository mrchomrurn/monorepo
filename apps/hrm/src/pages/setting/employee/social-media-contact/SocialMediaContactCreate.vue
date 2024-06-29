<script setup lang="ts">
import SocialMediaContactForm from './SocialMediaContactForm.vue'
</script>

<template>
  <SocialMediaContactForm :id="$route.query.id?.toString() || ''" type="create" />
</template>
