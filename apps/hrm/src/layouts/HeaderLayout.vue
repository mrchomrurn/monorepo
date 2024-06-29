<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDark, useToggle } from '@vueuse/core'
import { Moon, Sun, X } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'

import { useRoute } from 'vue-router'
import { Tabs, TabsIndicator, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Profile from '@/components/Profile.vue'
import { useTabStore } from '@/store/tab'
import { Button } from '@/components/ui/button'
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue'
import ScrollBar from '@/components/ui/scroll-area/ScrollBar.vue'

const tabStore = useTabStore()
const { tabs, currentActiveTab } = storeToRefs(tabStore)

const isDark = useDark({ initialValue: 'light' })
const toggleDark = useToggle(isDark)

const activeTab = ref<string>()

const route = useRoute()
watch(() => route.fullPath, () => {
  activeTab.value = currentActiveTab?.value?.name
})

watch(() => tabs.value.length, () => {
  activeTab.value = currentActiveTab?.value?.name
})

const headerLayout = ref<HTMLElement>()
onMounted(() => {
  // prevent tab from changing when mouse pressing down
  headerLayout.value?.addEventListener('pointerdown', e => e.preventDefault())
  activeTab.value = currentActiveTab?.value?.name
})
</script>

<template>
  <header ref="headerLayout" class="flex items-center justify-between">
    <ScrollArea class="h-12 grow">
      <Tabs v-model="activeTab">
        <TabsList class="relative h-12 w-full justify-start rounded-none border-b-2 bg-transparent p-0">
          <TabsIndicator class="absolute -bottom-0.5 left-0 h-[2px] w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded-full transition-[width,transform] duration-300">
            <div class="size-full bg-primary" />
          </TabsIndicator>
          <TabsIndicator class="pointer-events-none absolute -z-10 h-12 w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] transition-[width,transform] duration-300">
            <div class="size-full bg-accent" />
          </TabsIndicator>
          <TabsTrigger
            v-for="tab in tabs"
            :key="tab.name"
            :value="tab.name"
            class="h-full max-w-max gap-2 p-0 px-4 hover:text-primary data-[state=active]:bg-transparent data-[state=active]:text-primary"
            @click="tabStore.onTabClick(tab)"
          >
            <span>{{ tab.label }}</span>
            <button
              v-if="tab.label !== 'Dashboard'"
              class="rounded-full p-0.5 hover:bg-primary/10 hover:text-primary"
              @click.stop="tabStore.onTabRemove(tab.name)"
            >
              <X class="size-4" />
            </button>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>

    <section class=" flex h-full items-center gap-2 border-b-2 px-2">
      <Button
        variant="ghost"
        size="icon"
        class="mt-0.5"
        @click="toggleDark()"
      >
        <Moon v-if="isDark" :size="26" />
        <Sun v-else :size="26" />
      </Button>

      <Profile />
    </section>
  </header>
</template>
