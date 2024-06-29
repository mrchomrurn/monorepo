const ID_TOKEN_KEY = 'id_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

/**
 * @description get token form localStorage
 */
export const getToken = (): string | null => {
  return window.localStorage.getItem(ID_TOKEN_KEY)
}

/**
 * @description get token form localStorage
 */
export const getRefreshToken = (): string => {
  return window.localStorage.getItem(REFRESH_TOKEN_KEY) || ''
}

/**
 * @description save token into localStorage
 */
export const saveToken = (token: string, refreshToken: string): void => {
  window.localStorage.setItem(ID_TOKEN_KEY, token)
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

/**
 * @description remove token form localStorage
 */
export const destroyToken = (): void => {
  window.localStorage.removeItem(ID_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}
