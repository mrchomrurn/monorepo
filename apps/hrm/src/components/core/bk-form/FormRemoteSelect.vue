<script setup lang="ts">
import { Check, ChevronsUpDown, Loader2 } from 'lucide-vue-next'
import { ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface Props {
  name: string
  label: string
  list: Array<{ value: string, label: string }>
  isLoading?: boolean
  itemPlaceholder?: { value: string, label: string }
  disabled?: boolean
}

interface Emits {
  (e: 'search', search: string): void
}

defineProps<Props>()
const emits = defineEmits<Emits>()

const open = ref(false)
const model = ref({ value: '', label: '' })

const search = ref('')
const onSearch = useDebounceFn((search: string) => {
  emits('search', search)
})
</script>

<template>
  <FormField v-slot="{ handleChange, value }" :name="name">
    <FormItem>
      <FormLabel class="block w-max">
        {{ label }}
      </FormLabel>
      <Popover v-model:open="open">
        <PopoverTrigger as-child>
          <FormControl :disabled="disabled">
            <Button
              variant="outline"
              class="w-full justify-between"
              :class="!value && 'text-muted-foreground hover:text-muted-foreground'"
            >
              {{ model.label || itemPlaceholder?.label || 'Select' }}
              <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent
          class="w-[--radix-popper-anchor-width] p-0"
          align="start"
        >
          <Command
            v-model:search-term="search"
            @update:model-value="model = $event as any"
            @update:search-term="onSearch"
          >
            <CommandInput placeholder="Search" />
            <CommandEmpty class="flex items-center justify-center">
              <Loader2
                v-if="isLoading"
                class="animate-spin"
                :size="22"
              />
              <span v-else>Nothing found.</span>
            </CommandEmpty>
            <CommandList>
              <CommandItem
                v-for="item in list"
                :key="item.value"
                :value="item"
                @select="() => {
                  handleChange(item.value)
                  open = false
                }"
              >
                <Check
                  class="mr-2 size-4"
                  :class="item.value === (model.value || itemPlaceholder?.value)
                    ? 'opacity-100'
                    : 'opacity-0'
                  "
                />
                {{ item.label }}
              </CommandItem>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
