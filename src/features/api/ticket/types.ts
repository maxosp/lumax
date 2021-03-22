import { User } from '@/features/api/user/types'

export type getTicketsListQueryParams = {
  sort?: string
  subject?: number
  study_year?: number
  status?: string
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
}
export type Ticket = {
  id: number
  test_assignment: TestAssignmentType
  created_by: User
  moderate_by: User
  status: string
  comment?: string
  created_at?: string
  updated_at?: string
  moderated_at?: string
}

export type GetTypesResponse = {
  code: string
  name: string
}

export type UpdateTicketType = {
  tickets: number[]
  accept?: boolean | null
  send_to_revision?: boolean | null
  set_moderator?: boolean | null
  cancel_outcome?: boolean | null
}
