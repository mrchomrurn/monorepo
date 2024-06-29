import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { AxiosError } from 'axios'
import { capitalize } from 'lodash-es'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useNotification } from './useNotification'
import { api } from '@/services/api'
import type { DetailResponse } from '@/types/ApiResponse'
import { downloadFile } from '@/lib/utils'

interface Params {
  apiName: string
  queryKey?: ReadonlyArray<string>
}

export const useFile = ({ apiName, queryKey }: Params) => {
  const { onError, onSuccess: successToast } = useNotification()
  const queryClient = useQueryClient()
  const route = useRoute()

  const filename = computed(() => route.meta.title)
  const isExporting = ref(false)

  const exportFile = async () => {
    try {
      isExporting.value = true
      const res = await api.get(`/api/${apiName}/export`, { responseType: 'blob' })

      downloadFile(res.data, `${filename.value}.xlsx`)
    }
    catch (error) {
      onError(error as AxiosError)
    }
    finally {
      isExporting.value = false
    }
  }

  const importFile = useMutation({
    mutationFn: (file: File) => api.postForm<DetailResponse<string>>(`/api/${apiName}/import`, { file }),
    onSuccess: ({ data: res }) => {
      queryClient.invalidateQueries({ queryKey })
      successToast({ title: capitalize(res.message), description: res.data })
    },
  })

  return { exportFile, importFile, isExporting }
}
