import { createApiEffect } from '@/features/api/common/create-api-effect'
import { UploadMediaResponse } from '@/features/api/media/types'

export const getMediaFx = createApiEffect<number, UploadMediaResponse>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/media/${id}/`,
  }),
})
