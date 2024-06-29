import { useQuery } from '@tanstack/vue-query'
import { api } from '@/services/api'

export interface SubMenu {
  autoId: number
  id: string
  name: string
  mainMenuId: string
  icon: string
  type: string
  line: number
  view: boolean
  add: boolean
  edit: boolean
  delete: boolean
  post: boolean
  repost: boolean
  deletePosting: boolean
  print: boolean
  imp: boolean
  exp: boolean
  inactive: string
  link: string
}

export interface Menu {
  id: string
  name: string
  appId: string
  icon: string
  line: number
  inactive: string
  menu: SubMenu[]
}

export interface MenuResponse {
  data: Menu[]
  errorCode: string
  message: string
}

async function fetchMenu() {
  const res = await api.post<MenuResponse>('/discovery/menu/hrm')
  const { data } = res.data
  return data
}

export const useMenu = () => {
  return useQuery({
    queryKey: ['menu'],
    queryFn: fetchMenu,
    staleTime: Number.POSITIVE_INFINITY,
    select: (data) => {
      return [{
        id: 'dashboard',
        name: 'Dashboard',
        appId: 'dashboard',
        menu: [],
        icon: '',
        inactive: 'N',
        line: 0,
      }, ...data]
    },
  })
}
