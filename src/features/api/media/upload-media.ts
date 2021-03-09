import { createApiEffect } from '@/features/api/common/create-api-effect'
import { UploadMediaResponse } from '@/features/api/media/types'

export const uploadMediaFx = createApiEffect<FormData, UploadMediaResponse>({
  requestMapper: (body) => ({
    method: 'POST',
    url: '/api/media/media/upload/',
    body,
  }),
})
