<script setup lang="ts">
import { useField } from 'vee-validate'
import { Check, ChevronDown, Loader2 } from 'lucide-vue-next'

import { beautifyObjectName } from './utils'
import AutoFormLabel from './AutoFormLabel.vue'
import type { FieldProps } from './interface'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { TagsInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const props = withDefaults(defineProps<FieldProps & {
  items: Array<{ value: string, label: string }>
}>(), { items: () => [] })

const { value } = useField<string[]>(() => props.fieldName, {})

const filterFunction = (_: unknown, search: string) => props.items.filter(item => item.label.toLowerCase().includes(search.toLowerCase())).map(i => i.value)
</script>

<template>
  <FormField :name="fieldName">
    <FormItem :class="config?.class">
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || beautifyObjectName(label ?? fieldName) }}
      </AutoFormLabel>

      <Popover>
        <PopoverTrigger as-child>
          <FormControl>
            <TagsInput
              v-model="value"
              class="w-full"
              as-child
            >
              <Button
                :disabled
                variant="ghost"
                class="justify-start font-normal hover:bg-transparent"
              >
                <TagsInputItem
                  v-for="item in value"
                  :key="item"
                  :value="item"
                >
                  <span v-if="!items.length" class="flex h-6 items-center rounded bg-secondary px-2 py-1">
                    <Loader2 class="size-4 animate-spin opacity-50" />
                  </span>
                  <TagsInputItemText v-else>
                    {{ items.find(i => i.value === item)?.label }}
                  </TagsInputItemText>
                  <TagsInputItemDelete class="hover:bg-black/10" @click.stop.self />
                </TagsInputItem>
                <ChevronDown class="ml-auto size-4 opacity-50" />
              </Button>
            </TagsInput>
          </FormControl>
        </PopoverTrigger>

        <PopoverContent
          class="w-[--radix-popper-anchor-width] p-0"
          align="start"
        >
          <Command
            v-model="value"
            multiple
            :filter-function
          >
            <CommandInput placeholder="Search" />
            <CommandEmpty>Nothing found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                <CommandItem
                  v-for="item in items"
                  :key="item.value"
                  :value="item.value"
                >
                  <Check :class="cn('mr-2 h-4 w-4', value.includes(item.value) ? 'opacity-100' : 'opacity-0')" />
                  {{ item.label }}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <FormDescription v-if="config?.description">
        {{ config.description }}
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
