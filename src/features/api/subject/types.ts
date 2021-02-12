import { User } from '@/features/api/user/types'

export type StudyYear = {
  id: number
  number: number
  name: string
}

export type Subject = {
  id: number
  name: string
  icon?: number
  color?: number
  author: number
  is_mandatory: boolean
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
}

export type Theme = {
  id: number
  name: string
  is_prerequisite: boolean
  creation_datetime: string
  update_datetime: string
  prerequisites: ThemeListItem[]
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
}

export type CreateThemeType = {
  id?: number
  name: string
  is_prerequisite: boolean
  study_year_id?: number
  subject_id: number
  themes_ids: number[]
  prerequisites_ids: number[]
  parent_theme_id?: number
}

export type GetThemesTreeQueryParams = {
  sort?: string
  subject?: string
  study_year?: number
  is_prerequisite?: 'true' | 'false'
  created_by?: number
  has_assignment?: 'true' | 'false'
  search?: string
  search_all?: ''
  search_id?: ''
  search_name?: ''
  search_subject?: ''
  search_study_year?: ''
}
