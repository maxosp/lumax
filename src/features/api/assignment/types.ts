import { Theme } from '@/features/api/subject/types'
import { User } from '@/features/api/user/types'

export type Label = {
  id: number
  name: string
}

export type Tag = {
  id: number
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
