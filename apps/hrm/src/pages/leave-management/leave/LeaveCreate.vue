<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import LeaveForm from '@/pages/leave-management/leave/LeaveForm.vue'

const route = useRoute()
const id = computed(() => route.query.id?.toString() || '')
</script>

<template>
  <LeaveForm :id type="create" />
</template>
