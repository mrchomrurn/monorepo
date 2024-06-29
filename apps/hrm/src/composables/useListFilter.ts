import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import type { FilterOptions } from '@/lib/constants'

export interface FilterStorage { size: number, headerToHide: string[] }

export const useListFilter = (storageKey: string) => {
  const filterStorage = useStorage<FilterStorage>(storageKey, { size: 50, headerToHide: [] })

  const filterOptions = ref<FilterOptions>({ search: '', page: 0, size: filterStorage.value.size })

  return {
    filterOptions,
    filterStorage,
  }
}
