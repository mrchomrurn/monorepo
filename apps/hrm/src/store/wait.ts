import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { uniq } from 'lodash-es'

export const useWaitStore = defineStore('wait', () => {
  const waitingFor = ref<Array<string>>([])

  const is = computed(
    () => (waiter: string | Array<string>) => {
      if (Array.isArray(waiter))
        return waiter.some(waitKey => waitingFor.value.includes(waitKey))

      return waitingFor.value.includes(waiter)
    },
  )

  const start = (waiter: string) => {
    waitingFor.value = uniq([...waitingFor.value, waiter])
  }

  const end = (waiter: string) => {
    waitingFor.value = waitingFor.value.filter(waiting => waiting !== waiter,
    )
  }

  return {
    waitingFor,
    is,
    start,
    end,
  }
})
