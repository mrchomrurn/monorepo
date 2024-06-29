<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { CircleCheck, CircleUser, LogOut } from 'lucide-vue-next'

import KhmerFlag from '@/assets/cambodia.svg?component'
import USFlag from '@/assets/united-states.svg?component'
import ChineseFlag from '@/assets/chinese.svg?component'
import { useAuthStore } from '@/store/auth'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

const { purgeAuth } = useAuthStore()
const { availableLocales, locale: currentLocale } = useI18n()

const handleLocaleClick = (locale: string) => {
  currentLocale.value = locale
}

const flags: { [key: string]: any } = {
  en: USFlag,
  km: KhmerFlag,
  cz: ChineseFlag,
}

const languages: { [key: string]: string } = {
  en: 'English',
  km: 'ខ្មែរ',
  cz: '简体中文',
}

const handleSignOut = async () => {
  purgeAuth()
  window.location.replace('/login')
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        class="mt-0.5"
      >
        <CircleUser :size="26" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      class="w-[300px]"
    >
      <DropdownMenuLabel>
        <div class=" flex items-center gap-4">
          <img
            src="/balancika-logo.png"
            alt="company-logo"
            class="size-16"
          >
          <div>
            <p class="text-base">
              Admin
            </p>
            <p class="text-muted-foreground">
              admin@balancika.com
            </p>
          </div>
        </div>
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      <DropdownMenuItem class="py-2 hover:cursor-pointer" @select="$router.push({ name: 'company' })">
        {{ $t('yourCompanies') }}
      </DropdownMenuItem>

      <Accordion
        type="single"
        collapsible
        class="text-sm font-normal"
      >
        <AccordionItem value="item-1" class="border-none">
          <AccordionTrigger class="rounded-sm p-2 hover:cursor-default hover:bg-accent hover:no-underline">
            {{ $t('language') }}
          </AccordionTrigger>
          <AccordionContent class="px-2 pb-0">
            <template v-for="locale in availableLocales" :key="locale">
              <button
                class="flex w-full items-center gap-2 rounded-sm p-2 hover:text-primary"
                @click="handleLocaleClick(locale)"
              >
                <component :is="flags[locale]" class="size-5" />
                <p :class="[currentLocale === locale && 'text-primary']">
                  {{ languages[locale] }}
                </p>
                <CircleCheck
                  v-if="locale === currentLocale"
                  :size="16"
                  class="text-primary"
                />
              </button>
            </template>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <DropdownMenuSeparator />

      <div class="px-2 py-1">
        <Button
          size="sm"
          variant="destructive"
          class="w-full"
          @click="handleSignOut"
        >
          {{ $t('signOut') }}
          <LogOut class="ml-2" :size="16" />
        </Button>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
