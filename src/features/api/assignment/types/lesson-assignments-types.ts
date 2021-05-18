import {
  AssignmentFolderRelated,
  AssignmentsBulkParams,
  AssignmentStatus,
  AssignmentType,
  BaseAssignment,
} from '@/features/api/assignment/types/types'

export type LessonAssignment = {
  folder: AssignmentFolderRelated
} & BaseAssignment

export type LessonAssignmentRelated = {
  id?: number
  wording?: string
  type?: AssignmentType
  status?: AssignmentStatus
}

export type LessonAssignmentsBulkUpdate = {
  status?: AssignmentStatus
} & AssignmentsBulkParams
