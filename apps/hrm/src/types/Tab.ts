export interface ITab {
  key: string
  url: string
  fullUrl: string
  label: string
  componentName: string
  isNeedReRender?: boolean
  routeParams?: Record<string, any>
  routeQuery?: Record<string, any>
}
