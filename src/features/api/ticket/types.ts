import { User } from '@/features/api/user/types'
import { UploadMediaResponse } from '@/features/api/media/types'
import { StudyYear, SubjectGrid } from '@/features/api/subject/types'

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

export type Ticket = {
  id: number
  test_assignment: TestAssignmentType
  created_by: User
  moderate_by: User
  status: string
  comment?: TicketCommentType
  created_at?: string
  updated_at?: string
  moderated_at?: string
}

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
