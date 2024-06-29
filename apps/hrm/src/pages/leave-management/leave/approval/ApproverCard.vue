<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { extractPlaceholderText } from '@/lib/utils'
import { useLeaveApprover } from '@/pages/leave-management/leave/approval/useLeaveApprover'

const props = defineProps<{
  approverId: string
}>()

const { data, isPending } = useLeaveApprover(props.approverId)
</script>

<template>
  <div v-if="isPending" class="flex gap-4 pt-2">
    <Skeleton class="size-16 rounded-full" />
    <div class="mt-1.5 space-y-3">
      <Skeleton class="h-3 w-36" />
      <Skeleton class="h-3 w-28" />
    </div>
  </div>

  <template v-else>
    <div
      v-for="approver in data"
      :key="approver.empId"
      class="flex gap-4 pt-2"
    >
      <Avatar class="size-16">
        <AvatarImage :src="approver.profileImgUrl || ''" alt="approver profile image" />
        <AvatarFallback>
          <p class="text-xl">
            {{ extractPlaceholderText(approver.empName) }}
          </p>
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 class="text-md font-medium">
          {{ approver.empName }}
        </h2>
        <h3 class="text-sm text-muted-foreground">
          {{ approver.empPositionName }}
        </h3>
      </div>
    </div>
  </template>
</template>
