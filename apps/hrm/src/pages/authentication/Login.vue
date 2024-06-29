<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { Credential } from '@/store/auth'
import { useAuthStore } from '@/store/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const formData = ref<Credential>({ email: 'admin@balancika.com', password: 'admin@123@123' })

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const handleSubmit = async () => {
  await authStore.login(formData.value)

  if (route.redirectedFrom)
    router.push(route.redirectedFrom)
  else
    router.push('/')
}
</script>

<template>
  <section class="flex h-screen flex-col items-center justify-center px-4">
    <img
      class="mb-4 mr-2 w-28"
      src="/balancika-logo-1.png"
      alt="logo"
    >

    <div class="w-full max-w-lg space-y-4 rounded-lg px-6 py-4 shadow">
      <h1 class="pb-2 text-center text-2xl font-semibold">
        Login
      </h1>

      <Input
        v-model="formData.email"
        placeholder="name@company.com"
      />
      <Input
        v-model="formData.password"
        placeholder="••••••••"
      />

      <Button
        class="w-full"
        @click="handleSubmit"
      >
        Sign In
      </Button>

      <p class="text-info mx-auto">
        Not a member yet? <a href="#" class="font-medium text-primary hover:underline">Sign up</a>
      </p>
    </div>
  </section>
</template>
