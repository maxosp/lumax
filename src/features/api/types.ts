import { StudyYear, Subject, Theme } from '@/features/api/subject/types'
import { BaseAssignment, FolderType, Label, Tag } from '@/features/api/assignment/types'
import { ResourceType } from '@/features/api/media/types'

export type TreeElementType =
  | 'subject'
  | 'study_year'
  | 'theme'
  | 'virtual_folder'
  | 'assignment'
  | 'study_resource'
  | 'label'
  | 'olympiad_tag'
  | 'folder'

export type VirtualFolder = {
  name: string
  code: string
}

export type GetListQueryParams = {
  sort?: string
  page?: number
  per_page?: number
  subject?: number | null
  study_year?: number | null
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

export type TreeData = {
  element_type: TreeElementType
  folder: FolderType | null
  leaves: TreeData[]
  subject: Subject | null
  study_year: StudyYear | null
  theme: Theme | null
  label: Label | null
  olympiad_tag: Tag | null
  study_resource: ResourceType | null
  virtual_folder: VirtualFolder | null
  ordering_number: number
  assignment: BaseAssignment | null
}

export type GetThemeTreeFilterListResponse = {
  element_type: TreeElementType
  leaves: TreeData[]
  theme: {
    id: number
    name: string
  }
  virtual_folder: VirtualFolder | null
}
export type GetFolderTreeListResponse = {
  element_type: TreeElementType
  ordering_number: number
  leaves: TreeData[]
  folder: {
    id: number
    name: string
  }
}

type OlympiadTag = {
  id: number
  text: string
}
export type TreeDataLight = {
  element_type: TreeElementType
  ordering_number: number
  leaves: TreeData[]
  subject: Subject | null
  study_year: StudyYear | null
  theme: Theme | null
  olympiad_tag: OlympiadTag[]
}
export type TreeLightDataResponse = {
  total: number
  data: TreeDataLight[]
}
export type TreeDataResponse = {
  total: number
  data: TreeData[]
}

export type TreeDataInfoResponse = {
  total_amount: number
}

export type GetApplicationsCountersResponse = {
  deletion: number
  moderation: number
  total_count: number
}
