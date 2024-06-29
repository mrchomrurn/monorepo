<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import HeaderLayout from './HeaderLayout.vue'
import AsideLayout from './AsideLayout.vue'
import { useTabStore } from '@/store/tab'

const route = useRoute()
const tabStore = useTabStore()

const { cachedTabs } = storeToRefs(tabStore)
</script>

<template>
  <div class="flex h-dvh w-dvw">
    <AsideLayout />

    <section class="flex min-w-0 grow flex-col">
      <HeaderLayout />

      <RouterView v-slot="{ Component }">
        <KeepAlive :include="cachedTabs">
          <component :is="Component" :key="route.fullPath" />
        </KeepAlive>
      </RouterView>
    </section>
  </div>
</template>
