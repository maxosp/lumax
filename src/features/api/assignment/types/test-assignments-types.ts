import { Theme, ThemeRelated } from '@/features/api/subject/types'
import {
  AssignmentsBulkParams,
  AssignmentStatus,
  AssignmentType,
  BaseAssignment,
} from '@/features/api/assignment/types/types'

export type TestAssignmentStatus = AssignmentStatus | 'new' | 'moderation' | 'revision'

export type TestAssignment = {
  theme: Partial<Theme>
  theme_id: number
  labels_ids: number[]
} & BaseAssignment

export type TestAssignmentRelated = {
  id: number
  wording: string
  type: AssignmentType
  status: TestAssignmentStatus
  theme: ThemeRelated
}

export type TestAssignmentsBulkUpdate = {
  status?: TestAssignmentStatus
  difficulty?: number
  moderator_id?: number
} & AssignmentsBulkParams
