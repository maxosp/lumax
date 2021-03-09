import { StudyYear, Subject, Theme } from '@/features/api/subject/types'

export type Tag = {
  id: number
  name: string
  study_year: StudyYear | null
  subject: Subject | null
}

export type CreateTagType = {
  id?: number
  name: string
  subject_id: number
  study_year_id: number
}

export type CreateLabelType = CreateTagType & {
  theme_id: number
}

export type Label = Tag & {
  theme: Theme
}

export type GetTagsTreeQueryParams = {
  sort?: string
  subject?: string
  study_year?: number
  search?: string
  search_all?: string
  search_id?: string
  search_name?: string
  search_subject?: string
  search_study_year?: string
}

export type GetLabelsTreeQueryParams = {
  sort?: string
  subject?: string
  study_year?: number
  theme?: number
  search?: string
  search_all?: string
  search_id?: string
  search_name?: string
  search_subject?: string
  search_study_year?: string
}

export type DeleteTagsType = {
  olympiad_tags: number[]
}

export type GetTypesResponse = {
  code: string
  name: string
}

export type GetAssignmentTreeQueryParams = {
  sort?: string
  subject?: number
  study_year?: number
  difficulty?: number
  status?: number
  type?: number
  interface_language?: number
  labels?: number
  is_prerequisite?: boolean
  is_test_assignment?: boolean
  is_lesson_assignment?: boolean
  is_olympiad_assignment?: boolean
  search?: string
}

export type ListType = {
  code: string | number
  name: string
}
