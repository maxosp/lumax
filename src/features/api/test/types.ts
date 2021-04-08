import { StudyYear, Subject } from '@/features/api/subject/types'
import { User } from '@/features/api/user/types'

export type GetTestsListQueryParams = {
  sort?: string
  subject?: number
  study_year?: number
  difficulty?: number
  status?: string
  generator?: number
  search?: string
  page?: number
  per_page?: number
}

export type RequestDeleteTestsParams = {
  tests: number[]
  ticket_comment?: string
}

export type Test = {
  id: number
  name: string
  instruction: string
  final_text: string
  cms_comment: string
  generator: number
  status: number
  difficulty: number
  availability: number
  duration_min: number
  filter_by_year: boolean
  subject: Subject
  study_year: StudyYear
  created_at: string
  updated_at: string
  created_by: User
  updated_by: User
  subject_id: number
  study_year_id: number
}

export type TestList = {
  groups_names: string
  themes_amount: number
  assignments_amount: number
} & Test

export type ListType = {
  code: number
  name: string
}
