<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useNotification } from '@/composables/useNotification'

const props = defineProps<{
  url?: string
}>()

const { onError } = useNotification()
const svgData = ref()

const getSvg = async () => {
  if (!props.url) return
  try {
    const res = await fetch(props.url)
    const resData = await res.text()
    svgData.value = resData
  }
  catch (error) {
    onError(error as Error)
  }
}

onMounted(async () => {
  await getSvg()
})
</script>

<template>
  <span
    class="size-7"
    v-html="svgData"
  />
</template>
