import { StudyYear, Subject, Theme } from '@/features/api/subject/types'

export type GetListQueryParams = {
  sort?: string
  page?: number
  per_page?: number
  subject?: number
  study_year?: number
  is_prerequisite?: boolean
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

export type TreeElementType = 'subject' | 'study_year' | 'theme' | 'virtual_folder'

export type VirtualFolder = {
  name: string
}

export type TreeData = {
  element_type: TreeElementType
  leaves: TreeData[]
  subject: Subject | null
  study_year: StudyYear | null
  theme: Theme | null
  virtual_folder: VirtualFolder | null
  text_resource_count: string
  link_resource_count: string
  media_resource_count: string
}

export type TreeDataResponse = {
  total: number
  data: TreeData
}
