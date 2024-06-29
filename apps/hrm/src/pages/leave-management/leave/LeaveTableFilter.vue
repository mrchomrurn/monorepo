<script setup lang="ts">
import { CalendarIcon } from 'lucide-vue-next'
import { computed } from 'vue'
import { parseDate } from '@internationalized/date'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Status } from '@/pages/leave-management/leave/useLeave'

const model = defineModel<{ startDate: string, endDate: string, status: Status }>({ required: true })

const startDate = computed(() => parseDate(model.value.startDate))
const endDate = computed(() => parseDate(model.value.endDate))

function handleStartDateChange(value: string) {
  model.value.startDate = value
}

function handleEndDateChange(value: string) {
  model.value.startDate = value
}
</script>

<template>
  <div class="grid gap-2">
    <Label>Status</Label>
    <Select v-model="model.status">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="size in Object.values(Status)"
          :key="size"
          :value="size"
        >
          {{ size }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>

  <div class="space-y-1">
    <Label>Start Date</Label>
    <Popover>
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          class="w-full justify-start text-left font-normal"
          :class="startDate ?? 'text-muted-foreground'"
        >
          <CalendarIcon class="mr-2 size-4" />
          {{ startDate ? startDate.toString() : "Pick a date" }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <Calendar
          v-model="startDate"
          initial-focus
          @update:model-value="(value) => value && handleStartDateChange(value.toString())"
        />
      </PopoverContent>
    </Popover>
  </div>

  <div class="space-y-1">
    <Label>End Date</Label>
    <Popover>
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          class="w-full justify-start text-left font-normal"
          :class="startDate ?? 'text-muted-foreground'"
        >
          <CalendarIcon class="mr-2 size-4" />
          {{ endDate ? endDate.toString() : "Pick a date" }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <Calendar
          v-model="endDate"
          initial-focus
          @update:model-value="(value) => value && handleEndDateChange(value.toString())"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
