import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { getToken } from '@/services/jwt.ts'

const { VITE_APP_BASIC_AUTH_USERNAME, VITE_APP_BASIC_AUTH_PASSWORD, VITE_APP_BASE_PATH } = import.meta.env

export const api = axios.create({ baseURL: `${VITE_APP_BASE_PATH}/` })

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.url === '/oauth/token' || config.url === '/oauth/check_token') {
    const token = `${VITE_APP_BASIC_AUTH_USERNAME}:${VITE_APP_BASIC_AUTH_PASSWORD}`
    const encodedToken = btoa(token)

    config.headers.Authorization = `Basic ${encodedToken}`
  }
  else {
    const parts = window.location.href.split('/')
    let xProfileDb = ''
    if (VITE_APP_BASE_PATH)
      xProfileDb = parts[4]

    else
      xProfileDb = parts[3]

    xProfileDb = xProfileDb.replaceAll('-', '_')
    const token = getToken()

    config.headers['X-Profile-DB'] = xProfileDb
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use((response: AxiosResponse) => {
  // TODO: Implement
  return response
})
