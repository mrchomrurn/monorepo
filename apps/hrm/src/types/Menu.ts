export interface MainMenu {
  id: string
  name: string
  appId: string
  icon: string
  line: number
  inactive: string
  menu: SubMenu[]
}

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
