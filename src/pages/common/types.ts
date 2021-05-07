import { StudyYear, Subject } from '@/features/api/subject/types'
import { TreeData } from '@/features/api/types'
import { User } from '@/features/api/user/types'
import { Vuetable, VuetablePagination } from 'vuetable-2'

export type DropdownItem = {
  name: string
  title: string
  // for color dropdown
  value?: string
  // for class dropdown
  id?: number
  // for subject dropdown
  author?: number
  color?: number
  icon?: number
  is_mandatory?: boolean
  // for positions / themes dropdown
  is_prerequisite?: boolean
  study_year?: StudyYear
  subject?: Subject
  created_by?: User
  leaves?: TreeData[]
  // for types
  code?: string
  // for system files
  parent_id?: number | null
}

export type SelectedObjectType = {
  id: number
}

export type RefsType = {
  vuetable?: typeof Vuetable
  pagination?: typeof VuetablePagination
  fileInput?: {
    files: FileList
  }
}
export type ParamsHttpOptionsType = {
  page: number
  per_page: number
  sort: string
}

export type HttpOptionsType = {
  params: ParamsHttpOptionsType
}

export type FiltersParams = {
  sort?: string
  subject?: number
  study_year?: number
  difficulty?: number
  status?: number
  type?: number
  interface_language?: number
  labels?: number
  page?: number
  per_page?: number
  tags?: string
  created_by?: User
  moderate_by?: User
  is_prerequisite?: boolean
  is_test_assignment?: boolean
  is_lesson_assignment?: boolean
  is_olympiad_assignment?: boolean
  has_assignment?: boolean
  created_by_me?: boolean
  moderate_by_me?: boolean
  theme?: number
  search?: string
  search_area?: string
  folder?: number
  file_type?: string
}

export type PageParams = {
  currentPage?: number
  treeView?: boolean
}

export type ContextMenuType =
  | 'table_subjects'
  | 'subject'
  | 'table_theme'
  | 'table_tasks'
  | 'task'
  | 'table_lessons'
  | 'lesson'
  | 'assignment'

export type RightClickParams = {
  data: any
  event: any
  type?: ContextMenuType
}
