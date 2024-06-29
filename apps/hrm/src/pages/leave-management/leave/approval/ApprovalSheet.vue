<script setup lang="ts">
import { ChevronsUpDown, Users } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import ApproverCard from '@/pages/leave-management/leave/approval/ApproverCard.vue'
import ApprovalCard from '@/pages/leave-management/leave/approval/ApprovalCard.vue'
import { useLeaveApproval } from '@/pages/leave-management/leave/approval/useLeaveApproval'

interface Props {
  leaveId: string
  showApproval?: boolean
}

const props = defineProps<Props>()

const { data } = useLeaveApproval(props.leaveId)

const badgeVariants: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
  approved: 'default',
  pending: 'secondary',
  rejected: 'destructive',
}
</script>

<template>
  <Sheet>
    <TooltipProvider
      :delay-duration="0"
      disable-hoverable-content
      ignore-non-keyboard-focus
    >
      <Tooltip>
        <TooltipTrigger as-child>
          <SheetTrigger as-child>
            <Button
              v-show="showApproval"
              variant="outline"
              size="icon"
            >
              <Users />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>View Approval</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <SheetContent class="md:max-w-lg">
      <SheetHeader>
        <SheetTitle>Approval</SheetTitle>
        <SheetDescription class="sr-only">
          View Approval
        </SheetDescription>
      </SheetHeader>

      <section class="space-y-2 py-4">
        <template
          v-for="approval in data"
          :key="approval.id"
        >
          <ApprovalCard v-if="approval.status === 'approved'" :approval="approval" />
          <Collapsible
            v-else
            class="rounded-md border p-2 pl-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <h1 class="font-medium">
                  {{ approval.name }}
                </h1>
                <Badge :variant="badgeVariants[approval.status]">
                  {{ approval.status }}
                </Badge>
              </div>
              <CollapsibleTrigger as-child>
                <Button variant="ghost" size="sm">
                  <ChevronsUpDown class="size-4" />
                  <span class="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent class="space-y-2">
              <ApproverCard :approver-id="approval.id" />
            </CollapsibleContent>
          </Collapsible>
        </template>
      </section>
    </SheetContent>
  </Sheet>
</template>
