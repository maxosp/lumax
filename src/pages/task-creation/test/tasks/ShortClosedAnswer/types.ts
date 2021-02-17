import { UploadMediaResponse } from '@/features/api/media/types'

export type AudioFile = {
  isLimited: boolean
  limit: number
} & UploadMediaResponse
