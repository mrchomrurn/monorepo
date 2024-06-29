<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { onClickOutside } from '@vueuse/core'

import MainMenu from '@/components/menu/MainMenu.vue'
import SubMenu from '@/components/menu/SubMenu.vue'
import { useMenuStore } from '@/components/menu/menu'

const menuStore = useMenuStore()
const { openSubMenu, clickedMenuId } = storeToRefs(menuStore)

const mainMenuRef = ref<HTMLElement>()
const subMenuRef = ref<HTMLElement>()

onClickOutside(subMenuRef, () => {
  clickedMenuId.value = ''
  if (!openSubMenu.value) return
  openSubMenu.value = false
}, { ignore: [mainMenuRef] })

onMounted(() => {
  menuStore.fetchMenu()
})
</script>

<template>
  <aside class="flex">
    <MainMenu ref="mainMenuRef" />
    <SubMenu ref="subMenuRef" />
  </aside>
</template>
