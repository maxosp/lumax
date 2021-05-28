import { User, UserRelated } from '@/features/api/user/types'
import { UploadMediaResponse } from '@/features/api/media/types'
import { StudyYear, SubjectGrid, SubjectRelated, ThemeRelated } from '@/features/api/subject/types'
import { TestAssignmentRelated } from '@/features/api/assignment/types/test-assignments-types'
import { LessonAssignmentRelated } from '@/features/api/assignment/types/lesson-assignments-types'
import { OlympiadAssignmentRelated } from '@/features/api/assignment/types/olympiad-assignments-types'
import { AssignmentFolderRelated, MediaFolderRelated } from '@/features/api/assignment/types/types'

export type TicketStatus = 'new' | 'accepted' | 'declined'

export type getTicketsListQueryParams = {
  sort?: string
  subject?: number
  study_year?: number
  status?: number
  created_by?: User
  moderate_by?: User
  created_by_me?: boolean
  moderate_by_me?: boolean
  search?: string
  page?: number
  per_page?: number
}
export type getTicketsDeletionListQueryParams = {
  object_type?: string
} & getTicketsListQueryParams

export type TestAssignmentType = {
  id: number
  wording: string
  type: string
  status: string
  theme: {
    id: number
    name: string
    study_year: StudyYear
    subject: SubjectGrid
    type: string
    wording: string
  }
}

export type TicketCommentType = {
  id: number
  media: UploadMediaResponse
  text: string
}

export type BaseTicket = {
  id: number
  status: TicketStatus
  created_by: UserRelated
  moderate_by: UserRelated
  created_at?: string
  updated_at?: string
  moderated_at?: string
}

export type ModerationTicket = {
  test_assignment: TestAssignmentRelated
  comment?: TicketCommentType
} & BaseTicket

export type ObjectType =
  | 'theme'
  | 'subject'
  | 'test_assignment'
  | 'olympiad_assignment'
  | 'lesson_assignment'
  | 'media_folder'
  | 'assignment_folder'

export type DeletionTicket = {
  object_type: ObjectType
  test_assignment: TestAssignmentRelated
  olympiad_assignment: OlympiadAssignmentRelated
  lesson_assignment: LessonAssignmentRelated
  subject: SubjectRelated
  theme: ThemeRelated
  media_folder: MediaFolderRelated
  assignment_folder: AssignmentFolderRelated
  comment: string
  object_name: string
} & BaseTicket

export type GetTypesResponse = {
  code: string
  name: string
}

export type UpdateTicketBulkType = {
  tickets: number[]
  accept?: boolean | null
  send_to_revision?: boolean | null
  comment_id?: number | null
  set_moderator?: boolean | null
  moderator_id?: number | null
  cancel_outcome?: boolean | null
  decline?: boolean | null
}

export type UpdateTicketType = {
  id: number
  test_assignment: TestAssignmentType
  created_by: User
  moderate_by: User
  status: string
  comment: string
  moderated_at: string
  media_ids: number[]
}

export type CheckBeforeDeletionResponseType = {
  id: number
  object_type: string
  theme: {
    id: number
    parent_theme: number
    study_resources: number[]
    test_assignment: number[]
  }
  subject: {
    id: number
    themes: number[]
  }
}

export type TicketCommentRequestType = {
  text: string
  media_ids: number[]
}

export type TicketCommentResponseType = {
  id: number
  media: UploadMediaResponse
  created_by: User
  media_ids: number[]
}

export type TicketCommentFailType = {
  text: string[]
}
