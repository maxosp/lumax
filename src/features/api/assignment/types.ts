import { StudyYear, Subject, Theme } from '@/features/api/subject/types'
import { User } from '@/features/api/user/types'

export type Tag = {
  id: number
  name: string
  study_year: StudyYear | null
  subject: Subject | null
  assignments_count: number
  study_year_id: number
  subject_id: number
}

export type CreateTagType = {
  id?: number
  name: string
  subject_id: number
  study_year_id: number
}

export type CreateFolderType = {
  name: string
  parent_id: number | null
  owner?: number
}

export type FolderType = {
  id?: number
  name: string
  parent_id: number
  owner?: number
}

export type CreateLabelType = CreateTagType & {
  theme_id: number
}

export type Label = Tag & {
  theme: Theme
  assignments_count: number
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
  id?: number
  media?: number
  audio_limit_count?: number
}

export type DifficultyType = 0 | 1 | 2

type BaseCreateAssignmentParams = {
  wording?: string
  type?: AssignmentType
  status?: AssignmentStatus
  score?: number
  media?: number[]
  difficulty: DifficultyType
  is_add_score_for_each_answer?: boolean
  created_by?: Partial<User>
  updated_by?: Partial<User>
  verified_by?: Partial<User>
  verification_datetime?: string
  text?: string
  interface_language: string
  course?: string
  question_data?: any
  correct_answer?: any
  common_list_answer_choices?: any
  duplicate_count?: number
  audios_ids?: number[]
  example_answer?: string
}

export type CreateTestAssignmentFxParams = {
  theme?: Partial<Theme>
  theme_id: number
  labels?: number[]
  labels_ids?: number[]
} & BaseCreateAssignmentParams

export type CreateOlympiadAssignmentFxParams = {
  subject: Partial<Subject>
  subject_id: number
  study_year: StudyYear
  study_year_id: number
  tags: number[]
  tags_ids: number
} & BaseCreateAssignmentParams

export type CreateLessonAssignmentFxParams = BaseCreateAssignmentParams

export type BaseAssignment = {
  id: number
  wording: string
  type: AssignmentType
  status: AssignmentStatus
  score: number
  media: number[]
  difficulty: DifficultyType
  is_add_score_for_each_answer: boolean
  labels: number[]
  creation_datetime: string
  update_datetime: string
  verification_datetime: string
  created_by: Partial<User>
  updated_by: Partial<User>
  verified_by: Partial<User>
  text: string
  template_text: string
  interface_language: string
  course: string
  question_data: any // multiple-list-text-answer has another question_data structure
  correct_answer: any // multiple-choice-one-answer has another correct_answer structure
  common_list_answer_choices: any
  audios: AssignmentAudioFile[]
  duplicate_count: number
  audios_ids: number[]
  example_answer: string
  theme?: number
  subject?: number
  study_year?: number
}

export type TestAssignment = {
  theme: Partial<Theme>
  theme_id: number
  labels_ids: number[]
} & BaseAssignment

export type ClueType = {
  name: string
  price: number
}
export type OlympiadAssignment = {
  subject: Partial<Subject>
  subject_id: number
  study_year: StudyYear
  study_year_id: number
  tags: number[]
  tags_ids: number
  clue: ClueType[]
  answer_text: string
} & BaseAssignment

export type LessonAssignment = {
  folder: {
    id: number
    name: string
  }
} & BaseAssignment

export type DuplicateAssignmentType = {
  assignments: number[]
  number_of_duplicates?: number
}

export type SendToModerationParams = {
  assignments: number[]
  moderator_id?: number
}

export type UpdateAssignmentsBulkParams = {
  assignments: number[]
  status?: string
  difficulty?: number
  moderator_id?: number
  score?: number
}

export type RequestDeleteAssignmentsParams = {
  assignments: number[]
  ticket_comment?: string
}

export type RequestDeleteThemesParams = {
  themes: number[]
  ticket_comment?: string
}

export type RequestDeleteSubjectsParams = {
  subjects: number[]
  ticket_comment?: string
}
