import type { AxiosError } from 'axios'
import { useToast } from '@/components/ui/toast'

interface ApiError {
  data: unknown
  message: string
  errorCode: number
}

export const useNotification = () => {
  const { toast } = useToast()

  const onAxiosError = (err: AxiosError<ApiError>) => {
    // eslint-disable-next-line no-console
    console.log(err)

    const message = err.response?.data.message
    const title = message ? 'Action Failed' : 'Something Went Wrong'
    const description = message ?? err.message

    toast({
      title,
      description,
      variant: 'destructive',
    })
  }

  const onError = (err: Error) => {
    // eslint-disable-next-line no-console
    console.log(err)

    toast({
      title: 'Something Went Wrong',
      description: err.message,
      variant: 'destructive',
    })
  }

  const onSuccess = ({ title, description }: { title: string, description: string }) => {
    toast({
      title,
      description,
    })
  }

  return { onAxiosError, onError, onSuccess }
}
