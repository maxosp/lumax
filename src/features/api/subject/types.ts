export type StudyYear = {
  id: number
  number: number
  name: string
}

export type Subject = {
  id: number
  name: string
  icon: number
  color: number
  author: number
  is_mandatory: boolean
}

export type ThemeListItem = {
  id: number
  name: string
  study_year: number
  subject: Subject
}

export type Theme = {
  id: number
  name: string
  is_prerequisite: boolean
  creation_datetime: string
  update_datetime: string
  prerequisites: ThemeListItem[]
  study_year: StudyYear
  subject: Subject
  prerequisites_ids: number[]
  study_year_id: number
  subject_id: number
}
