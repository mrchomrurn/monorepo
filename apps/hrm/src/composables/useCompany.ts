import { useQuery } from '@tanstack/vue-query'
import { api } from '@/services/api'

export interface Company {
  var_id: string
  var_name: string
  var_img: string
  var_phone: string
  var_email: string
  var_website: string
  var_address: string
  inactive: number
  numUser: number
  numLocation: number
  un: string
  apiData: string
  apiCdn: string
  cdn: string
  cdnPath: string
  serverProfileId: number
  versionId: number
  userOwner: number
  var_un: string
  pass: string
}

const fetchCompanies = async () => {
  const { data } = await api.post<Company[]>('/discovery/company')
  return data
}

export const useCompany = () => {
  return useQuery({
    queryKey: ['company'],
    queryFn: fetchCompanies,
    staleTime: Number.POSITIVE_INFINITY,
  })
}
