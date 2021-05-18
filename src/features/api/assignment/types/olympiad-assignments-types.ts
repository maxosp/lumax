import { StudyYear, Subject } from '@/features/api/subject/types'
import {
  AssignmentsBulkParams,
  AssignmentStatus,
  AssignmentType,
  BaseAssignment,
} from '@/features/api/assignment/types/types'

export type OlympiadAssignment = {
  subject: Partial<Subject>
  subject_id: number
  study_year: StudyYear
  study_year_id: number
  tags: number[]
  tags_ids: number
  clues: number[]
  answer_text: string
} & BaseAssignment

export type OlympiadAssignmentRelated = {
  id?: number
  wording?: string
  type?: AssignmentType
  status?: AssignmentStatus
}

export type OlympiadAssignmentsBulkUpdate = {
  status?: AssignmentStatus
  difficulty?: number
  score?: number
} & AssignmentsBulkParams
