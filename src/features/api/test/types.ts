import { StudyYear, Subject, Theme } from '@/features/api/subject/types'
import { User } from '@/features/api/user/types'
import { TestAssignment } from '@/features/api/assignment/types'

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

export type CreateTestFxParams = {
  name: string
  instruction: string
  cms_comment: string
  generator: number
  status?: number
  difficulty: number
  availability?: number
  duration_min: number | null
  filter_by_year: boolean
  subject?: Subject
  study_year?: StudyYear
  created_by?: User
  updated_by?: User
  subject_id?: number | null
  study_year_id: number | null
}

export type CreateTestAutoItemFxParams = {
  theme: Partial<Theme>
  order_number: number
  test_id: number
  theme_id: number
}

export type CreateTestFinalTextFxParams = {
  score_min: number | null
  score_max: number | null
  text: string
  test_id: number
}

export type AutoItem = {
  id?: number
  test?: number
  theme: Theme
  order_number: number
  test_id?: number
  theme_id: number
}

export type AutoItemTheme = {
  id?: number
  name: string
}

export type ManualItem = {
  id: number
  assignments: TestAssignment[]
  score: number
  order_number: number
}

export type FinalText = {
  id: number
  test: number
  score_min: number | null
  score_max: number | null
  text: string
  test_id: number
}

export type FinalTextRelated = {
  id?: number
  score_min: number | null
  score_max: number | null
  text: string
  test_id?: number
}

export type Test = {
  id: number
  name: string
  instruction: string
  cms_comment: string
  generator: number
  status: number
  difficulty?: number
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
  manual_items: ManualItem[]
  auto_items: AutoItem[]
  final_texts: FinalText[]
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
