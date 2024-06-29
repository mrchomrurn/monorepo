<script setup lang="ts">
import { LayoutDashboard } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import BkNetworkSvg from '@/components/core/BkNetworkSvg.vue'
import { useMenuStore } from '@/components/menu/menu'

const menuStore = useMenuStore()
const { onMenuClicked } = menuStore
const { mainMenu, isLoading, activeMainMenu, clickedMenuId } = storeToRefs(menuStore)
</script>

<template>
  <div class="w-28 border-r-2 p-4">
    <div class="px-2">
      <img src="/balancika-logo.png" alt="balancika logo">
    </div>

    <ul class="pt-6">
      <template v-if="isLoading">
        <div
          v-for="i in 2"
          :key="i"
          class="mb-2 w-full space-y-2 p-2"
        >
          <Skeleton class="mx-auto size-7" />
          <Skeleton class="mx-auto h-2 w-14" />
        </div>
      </template>
      <template v-else>
        <li
          v-for="menu in mainMenu"
          :key="menu.id"
          class="mb-2 flex min-h-max items-center justify-center rounded px-4 py-2 hover:cursor-pointer hover:bg-accent"
          :class="[clickedMenuId === menu.id || activeMainMenu.id === menu.id ? 'bg-accent text-primary' : '']"
          @click="onMenuClicked(menu)"
        >
          <RouterLink
            v-if="menu.id === 'dashboard'"
            :to="{ name: 'dashboard' }"
            class="flex flex-col items-center justify-center"
          >
            <LayoutDashboard class="size-6" />
            <p class="pt-1 text-xs">
              {{ menu.name }}
            </p>
          </RouterLink>
          <div v-else class="flex flex-col items-center">
            <BkNetworkSvg :url="menu.icon" />
            <p class="text-center text-xs">
              {{ menu.name }}
            </p>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>
