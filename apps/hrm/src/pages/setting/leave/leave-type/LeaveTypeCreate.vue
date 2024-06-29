<script setup lang="ts">
import LeaveTypeForm from '@/pages/setting/leave/leave-type/LeaveTypeForm.vue'
</script>

<template>
  <LeaveTypeForm :id="$route.query.id?.toString() || ''" type="create" />
</template>
