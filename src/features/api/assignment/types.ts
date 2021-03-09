import { StudyYear, Subject, Theme } from '@/features/api/subject/types'
import { User } from '@/features/api/user/types'

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

export type AssignmentType =
  | 'SHORT_CLOSED_ANSWER'
  | 'MULTIPLE_SHORT_CLOSED_ANSWER'
  | 'MULTIPLE_CHOICE_ONE_OR_MANY_ANSWERS'
  | 'MULTIPLE_CHOICE_ONE_ANSWER'
  | 'BROAD_OPEN_ANSWER'
  | 'COMMON_LIST_STRING_ANSWER'
  | 'CORRECT_SEQUENCE_ANSWER'
  | 'CONNECT_LINES_ANSWER'
  | 'MOVING_IMAGES_IMAGE_INPUT_ANSWER'
  | 'MOVING_IMAGES_TEXT_INPUT_ANSWER'
  | 'COMMON_LIST_TEXT_ANSWER'
  | 'MULTIPLE_LIST_TEXT_ANSWER'
  | 'BROAD_FILE_ANSWER'
  | 'COLOR_HIGHLIGHT_ANSWER'

export type AssignmentStatus =
  | 'new'
  | 'moderation'
  | 'revision'
  | 'reserve'
  | 'published'
  | 'archive'

export type AssignmentAudioFile = {
  id: number
  audio_limit_count?: number
}

export type CreateAssignmentFxParams = {
  wording?: string
  type?: AssignmentType
  status?: AssignmentStatus
  is_test_assignment?: boolean
  is_lesson_assignment?: boolean
  is_olympiad_assignment?: boolean
  is_archived?: boolean
  is_reserved?: boolean
  theme?: Partial<Theme>
  theme_id: number
  score?: number
  media?: number[]
  audio?: AssignmentAudioFile[]
  difficulty: string
  olympiad_clue?: any
  olympiad_tags?: number[]
  labels?: number[]
  created_by?: Partial<User>
  updated_by?: Partial<User>
  verified_by?: Partial<User>
  verification_datetime?: string
  text?: string
  example_answer?: string
  interface_language: string
  course_theme?: string
  question_data?: any
  correct_answer?: any
  common_list_answer_choices?: any
  labels_ids?: number[]
  olympiad_tags_ids?: number[]
  duplicate_count?: number
}

export type Assignment = {
  id: number
  wording: string
  type: AssignmentType
  status: AssignmentStatus
  is_test_assignment: boolean
  is_lesson_assignment: boolean
  is_olympiad_assignment: boolean
  is_archived: boolean
  is_reserved: boolean
  theme: Partial<Theme>
  theme_id: number
  score: number
  media: number[]
  audio?: AssignmentAudioFile[]
  difficulty: string
  olympiad_clue: any
  olympiad_tags: number[]
  labels: number[]
  creation_datetime: string
  update_datetime: string
  verification_datetime: string
  created_by: Partial<User>
  updated_by: Partial<User>
  verified_by: Partial<User>
  text: string
  example_answer: string
  interface_language: string
  course_theme: string
  question_data: any
  correct_answer: any
  common_list_answer_choices: any
  labels_ids: number[]
  olympiad_tags_ids: number[]
  duplicate_count: number
}
