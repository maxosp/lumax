import { User } from '@/features/api/user/types'

export type StudyYear = {
  id: number
  number: number
  name: string
  subject_id: number
}

export type Icon = {
  id: number
  name: string
  value: string
}

export type File = {
  id: number
  owner: number
  file: string
  file_name: string
  file_type: string
}

export type SubjectGrid = {
  id: number
  name: string
  icon?: number
  color?: number
  author: number
  is_mandatory: boolean
}

export type Subject = {
  id: number
  name: string
  description: string
  useful_info: string
  short_useful_info: string
  icon: number
  image: number
  is_mandatory: boolean
  creation_datetime: string
  update_datetime: string
  author?: {
    first_name: string
    last_name: string
    is_moderator: boolean
    is_teacher: boolean
    is_student: boolean
  }
  color: {
    id: number
    name: string
    value: string
  }
}

export type ParentTheme = {
  name: string
  is_prerequisite: boolean
  study_year: StudyYear
  subject: Subject
  created_by: User
  id: number
}

export type ThemeListItem = {
  id: number
  name: string
  study_year: number
  subject: Subject
  is_prerequisite: boolean
}

export type Theme = {
  id: number
  name: string
  is_prerequisite: boolean
  creation_datetime: string
  update_datetime: string
  prerequisites: ThemeListItem[]
  themes: ThemeListItem[]
  study_year: StudyYear
  subject: Subject
  prerequisites_ids: number[]
  study_year_id: number
  subject_id: number
  created_by_id: number
  updated_by_id: number
  created_by: User
  updated_by: User
  parent_theme: ParentTheme
  parent_theme_id: number
  assignments_amount: number
  study_resource_amount: number
}

export type CreateThemeType = {
  id?: number
  name: string
  is_prerequisite: boolean
  study_year_id?: number
  subject_id: number
  themes_ids: number[]
  prerequisites_ids: number[]
  parent_theme_id?: number | null
}

export type GetThemesTreeQueryParams = {
  sort?: string
  subject?: number
  study_year?: number
  is_prerequisite?: boolean
  created_by?: User
  has_assignment?: boolean
  search?: string
  search_area?: string
}

export type CreateSubjectType = {
  id?: number
  name: string
  description?: string
  useful_info?: string
  short_useful_info?: string
  icon?: number
  image?: number
  is_mandatory?: boolean
  author_id?: number
  color_id?: number
  author?: {
    first_name: string
    last_name: string
    is_moderator: boolean
    is_teacher: boolean
    is_student: boolean
  }
  color?: {
    id: number
    name: string
    value: string
  }
}
