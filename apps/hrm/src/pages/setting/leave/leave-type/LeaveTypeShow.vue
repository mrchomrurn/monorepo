<script setup lang="ts">
import LeaveTypeForm from '@/pages/setting/leave/leave-type/LeaveTypeForm.vue'
</script>

<template>
  <LeaveTypeForm :id="$route.params.id as string || ''" type="show" />
</template>
