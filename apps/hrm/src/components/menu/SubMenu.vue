<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue'
import { useMenuStore } from '@/components/menu/menu'

const menuStore = useMenuStore()
const { generateMenuUrl } = menuStore
const { currentSubMenu, openSubMenu, accordionSubMenu } = storeToRefs(menuStore)

const defaultOpenSubMenu = computed({
  get: () => accordionSubMenu.value,
  set: v => accordionSubMenu.value = v,
})
</script>

<template>
  <ScrollArea type="scroll">
    <Transition>
      <section
        v-if="openSubMenu"
        class="min-h-dvh w-72 border-r-2 px-4"
      >
        <Accordion
          v-model:model-value="defaultOpenSubMenu"
          collapsible
          type="multiple"
        >
          <template v-for="(subMenu, subMenuType) in currentSubMenu" :key="subMenuType">
            <AccordionItem :value="subMenuType" class="border-none">
              <AccordionTrigger class="overflow-hidden whitespace-nowrap text-primary">
                <div class="flex items-center gap-2">
                  <img :src="subMenu[0].icon" class="inline-block size-5">
                  <span> {{ subMenuType }}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent class="px-4 pb-0">
                <template v-for="sub in subMenu" :key="sub.id">
                  <RouterLink
                    :to="generateMenuUrl(sub)"
                    class="group mb-0.5 flex items-center gap-2 p-2 text-sm"
                    active-class="text-primary [&>div]:bg-primary bg-accent rounded-md"
                    @click="openSubMenu = false"
                  >
                    <div class="inline-block size-1 rounded-full bg-muted-foreground group-hover:bg-primary" />
                    <span class="truncate group-hover:text-primary">{{ sub.name }}</span>
                  </RouterLink>
                </template>
              </AccordionContent>
            </AccordionItem>
          </template>
        </Accordion>
      </section>
    </Transition>
  </ScrollArea>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.4s ease-out;
}

.v-enter-from,
.v-leave-to {
  width: 0;
  padding: 0;
}
</style>
