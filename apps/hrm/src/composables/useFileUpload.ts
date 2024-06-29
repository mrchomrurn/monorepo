import { useMutation } from '@tanstack/vue-query'
import { api } from '@/services/api'
import type { DetailResponse } from '@/types/ApiResponse'

export interface FileAttachment {
  fileName: string
  cdn: string
}

const uploadFile = async (file: File | FileList) => {
  const formData = new FormData()
  if (file instanceof FileList) {
    for (const f of file)
      formData.append('file', f)
  }
  else {
    formData.append('file', file)
  }
  const { data: res } = await api.post<DetailResponse<FileAttachment[]>>('/api/file/upload-temp', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

  return res.data
}

export const useFileUpload = () => {
  return useMutation({
    mutationFn: uploadFile,
  })
}
