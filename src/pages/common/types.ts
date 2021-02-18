import { StudyYear, Subject } from '@/features/api/subject/types'
import { TreeData } from '@/features/api/types'
import { User } from '@/features/api/user/types'

export type DropdownItem = {
  name: string
  title: string
  // for class dropdown
  id?: number
  // for subject dropdown
  author?: number
  color?: number
  icon?: number
  is_mandatory?: boolean
  // for positions / themes dropdown
  is_prerequisite?: boolean
  study_year?: StudyYear
  subject?: Subject
  created_by?: User
  leaves?: TreeData[]
}
