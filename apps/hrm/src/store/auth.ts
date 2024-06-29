import { ref } from 'vue'
import { defineStore } from 'pinia'
import { AxiosError } from 'axios'

import { destroyToken, getToken, saveToken } from '@/services/jwt'
import { api } from '@/services/api.ts'
import { useWaitStore } from '@/store/wait.ts'
import { useNotification } from '@/composables/useNotification'

export interface Company {
  clientId: string
  db: string
  empId: string
  endPoint: string
  id: number
}

export interface User {
  intUserId: number
  user_name: string
  scope?: Array<string>
  active?: boolean
  company?: Array<Company>
  exp?: number
  authorities?: Array<string>
  jti?: number
  varUserId?: string
  client_id?: string
  username?: string
}

export interface Auth {
  access_token: string
  token_type: string
  refresh_token: string
  expires_in: number
  scope: string
  company: Array<any>
  intUserId: number
  varUserId: string
  username: string
  jti: string
}

export interface Credential {
  email: string
  password: string
}

const LOADING_KEY = {
  login: 'auth.login',
}

export const useAuthStore = defineStore('auth', () => {
  const waitStore = useWaitStore()
  const { onError } = useNotification()

  const errors = ref()
  const user = ref<User>()
  const isAuthenticated = ref(!!getToken())

  const setAuth = (auth: Auth) => {
    isAuthenticated.value = true
    saveToken(auth.access_token, auth.refresh_token)
  }

  const purgeAuth = () => {
    isAuthenticated.value = false
    user.value = undefined
    errors.value = undefined
    destroyToken()
  }

  const verifyAuth = async () => {
    const token = getToken()
    if (!token) return

    try {
      const { data } = await api.get<User>('/oauth/check_token', {
        params: { token },
      })

      user.value = data
    }
    catch (error) {
      if (error instanceof AxiosError)
        purgeAuth()
    }
  }

  const login = async (credentials: Credential) => {
    waitStore.start(LOADING_KEY.login)

    const { email, password } = credentials
    const formData = new FormData()

    formData.append('username', email)
    formData.append('password', password)
    formData.append('grant_type', 'password')

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    try {
      const { data: result } = await api.post<Auth>('/oauth/token', formData, { headers })

      setAuth(result)
      await verifyAuth()
    }
    catch (e) {
      onError(e as AxiosError)
    }
    finally {
      waitStore.end(LOADING_KEY.login)
    }
  }

  // function forgotPassword(email: string) {
  //   return ApiService.post('forgot_password', email)
  //     .then(() => {
  //       setError({})
  //     })
  //     .catch(({ response }) => {
  //       setError(response.data.errors)
  //     })
  // }

  // const refreshToken = async () => {
  //   try {
  //     const formData = new FormData()
  //     formData.append('grant_type', 'refresh_token')
  //     formData.append('refresh_token', StorageService.get('refresh_token')!)
  //     const { data } = await ApiService.post('/oauth/token', formData)
  //     setAuth(data)
  //   }
  //   catch (e) {
  //     purgeAuth()
  //   }
  // }

  return {
    LOADING_KEY,
    errors,
    user,
    isAuthenticated,
    login,
    verifyAuth,
    purgeAuth,
    // register,
    // forgotPassword,
    // refreshToken,
  }
})
