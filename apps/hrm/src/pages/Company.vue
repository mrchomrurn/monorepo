<script setup lang="ts">
import { useRouter } from 'vue-router'

import Button from '@/components/ui/button/Button.vue'
import { useAuthStore } from '@/store/auth'
import { useTabStore } from '@/store/tab'
import type { Company } from '@/composables/useCompany'
import { useCompany } from '@/composables/useCompany'

const { data } = useCompany()

const router = useRouter()
const tabStore = useTabStore()

const onSelectCompany = async (company: Company) => {
  tabStore.tabs = []
  await router.push(`${company.var_id.replaceAll('_', '-')}/`)
}

const { purgeAuth } = useAuthStore()
const logout = () => {
  purgeAuth()
  router.push({ name: 'login' })
}
</script>

<template>
  <div
    class="flex h-screen flex-col items-center justify-center gap-4 p-2"
  >
    <h1 class="text-info-900 text-center text-2xl font-medium">
      {{ $t('selectACompany') }}
    </h1>

    <div class="flex h-[34rem] w-80 flex-col overflow-auto rounded-md border  bg-white p-4 md:w-full md:max-w-md">
      <template
        v-for="(company) in data"
        :key="company.var_id"
      >
        <div
          class="group mb-3 flex items-center gap-2 rounded-md border p-3 transition-colors last:mb-0 hover:cursor-pointer hover:bg-accent "
          @click="onSelectCompany(company)"
        >
          <div>
            <img
              :src="company.var_img"
              :alt="company.var_name"
              class="w-40"
            >
          </div>
          <div class="overflow-hidden">
            <span class="text-sm md:text-base">
              {{ company.var_name }}
            </span>
            <p class="text-info truncate text-xs md:text-sm">
              {{ company.var_address }}
            </p>
          </div>
        </div>
      </template>
    </div>

    <Button
      variant="destructive"
      @click="logout()"
    >
      {{ $t('logout') }}
    </Button>
  </div>
</template>
