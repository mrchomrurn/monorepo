<script setup lang="ts">
import { FieldArray } from 'vee-validate'
import { Plus, Trash } from 'lucide-vue-next'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface Props {
  name: string
  label: string
  subLabel: string
  disabled?: boolean
}

defineProps<Props>()
</script>

<template>
  <FormField :name="name">
    <FieldArray
      v-slot="{ fields, remove, push }"
      :name="name"
    >
      <FormItem>
        <FormLabel class="text-base">
          {{ label }}
        </FormLabel>

        <template v-for="(field, index) of fields" :key="field.key">
          <section class="p-1">
            <Accordion
              as-child
              collapsible
              type="single"
              class="w-full"
              :default-value="field.key.toString()"
            >
              <FormItem>
                <AccordionItem :value="field.key.toString()" class="border-none ">
                  <AccordionTrigger class="flex-initial">
                    <FormLabel class="mr-4 text-base hover:cursor-pointer">
                      {{ subLabel }}
                    </FormLabel>
                  </AccordionTrigger>
                  <AccordionContent class="grid gap-2 p-1 md:grid-cols-2 lg:grid-cols-4">
                    <slot :field-name="`${name}[${index}]`" />
                  </AccordionContent>
                </AccordionItem>
              </FormItem>
            </Accordion>
          </section>

          <div class="!my-2 flex justify-end">
            <Button
              type="button"
              size="icon"
              variant="destructive"
              :disabled="disabled"
              @click="remove(index)"
            >
              <Trash :size="16" />
            </Button>
          </div>
          <Separator v-if="!field.isLast" />
        </template>

        <Button
          type="button"
          variant="outline"
          size="icon"
          class="flex items-center"
          :disabled="disabled"
          @click="push(null)"
        >
          <Plus :size="18" />
        </Button>

        <FormMessage />
      </FormItem>
    </FieldArray>
  </FormField>
</template>
