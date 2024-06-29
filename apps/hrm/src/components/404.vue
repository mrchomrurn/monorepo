<script setup lang="ts">
import { Button } from './ui/button'
</script>

<template>
  <section class="grid h-screen place-items-center dark:bg-gray-900">
    <div class="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
      <div class="mx-auto max-w-screen-sm text-center">
        <h1 class="mb-4 text-7xl font-extrabold tracking-tight text-primary dark:text-primary lg:text-9xl">
          404
        </h1>
        <p class="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
          Something's missing.
        </p>
        <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
          Sorry, we can't find that page. You'll find lots to explore on the home page.
        </p>
        <Button as-child>
          <RouterLink :to="{ name: 'company' }">
            Back to Homepage
          </RouterLink>
        </Button>
      </div>
    </div>
  </section>
</template>
