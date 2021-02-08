export type GetListQueryParams = {
  sort?: string
  page?: number
  per_page?: number
}

export type TableDataResponse<T> = {
  next_page_url: string
  prev_page_url: string
  current_page: number
  last_page: number
  total: number
  per_page: number
  data: T
}
