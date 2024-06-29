<script setup lang="ts">
import { CalendarIcon, Clock } from 'lucide-vue-next'
import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { extractPlaceholderText } from '@/lib/utils'
import type { LeaveApproval } from '@/pages/leave-management/leave/approval/useLeaveApproval'

defineProps<{ approval: LeaveApproval }>()
</script>

<template>
  <div class="flex gap-4 rounded-md border p-3">
    <Avatar class="size-16">
      <AvatarImage :src="approval.profileImgUrl || ''" alt="approver profile image" />
      <AvatarFallback>
        <p class="text-xl">
          {{ extractPlaceholderText(approval.empName) }}
        </p>
      </AvatarFallback>
    </Avatar>
    <div>
      <h2 class="text-md font-medium">
        {{ approval.empName }}
      </h2>
      <h3 class="text-sm text-muted-foreground">
        {{ approval.empPositionName }}
      </h3>
    </div>
    <div class="ml-auto space-y-1 text-right">
      <span v-if="approval.actionDateTime" class="flex items-center justify-end gap-2">
        <p class="text-sm">{{ format(approval.actionDateTime as Date, 'dd MMMM yyyy') }}</p>
        <CalendarIcon :size="16" />
      </span>
      <span v-if="approval.actionDateTime" class="flex items-center justify-end gap-2">
        <p class="text-sm">{{ format(approval.actionDateTime as Date, 'hh:mm a') }}</p>
        <Clock :size="16" />
      </span>
      <Badge class="hover:bg-primary">
        {{ approval.status }}
      </Badge>
    </div>
  </div>
</template>
