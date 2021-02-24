import { UploadMediaResponse } from '@/features/api/media/types'

export type AudioFile = {
  isLimited: boolean
  limit: number
} & UploadMediaResponse

export type CorrectAnswerInput = {
  id: number
  value: string
  mark?: string
}

export type QuestionAnswers = {
  id: number
  question: string
  answers: CorrectAnswerInput[]
}
