export interface DetailResponse<T> {
  code: string
  message: string
  data: T
}

export interface ListData<T> {
  totalPage: number
  totalElement: number
  list: Array<T>
}

export interface ListResponse<T> {
  code: string
  message: string
  data: ListData<T>
}

export interface MessageResponse {
  code: string
  message: string
  msg: string
}

export interface CreateResponse extends MessageResponse {
  data: { id: string }
}
