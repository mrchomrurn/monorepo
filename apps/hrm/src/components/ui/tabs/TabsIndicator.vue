<script setup lang="ts">
import { TabsIndicator, useForwardPropsEmits } from 'radix-vue'
import type { TabsIndicatorProps } from 'radix-vue'

const props = defineProps<TabsIndicatorProps>()

const forwarded = useForwardPropsEmits(props)
</script>

<template>
  <TabsIndicator v-bind="forwarded">
    <slot />
  </TabsIndicator>
</template>
