import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CopyToMediaType, UploadMediaResponse } from '@/features/api/media/types'

export const mediaCopyToFx = createApiEffect<CopyToMediaType, UploadMediaResponse>({
  requestMapper: (params) => ({
    method: 'POST',
    url: '/api/media-app/media/copy-to/',
    body: params,
  }),
})
