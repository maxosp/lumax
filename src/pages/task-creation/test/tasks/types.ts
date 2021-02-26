import { UploadMediaResponse } from '@/features/api/media/types'
import { DropdownItem } from '@/pages/common/types'

export type AudioFile = {
  isLimited: boolean
  limit: number
} & UploadMediaResponse

export type ShortClosedAnswer = {
  id: number
  value: string
}

export type MultipleShortClosedAnswer = {
  mark?: string
} & ShortClosedAnswer

export type MultipleShortClosedQuestion = {
  id: number
  question: string
  answers: MultipleShortClosedAnswer[]
}

export type MultipleChoiceOneOrManyQuestion = {
  id: number
  question: string
  answer: string
  mark?: string
  isCorrect: boolean
}

export type CommonListStringQuestion = {
  id: number
  question: string
  answer: string
}

export type AnswerOption = {
  id: number
} & DropdownItem

export type CorrectSequenceQuestion = {
  id: number
  question: string
  order: number
}