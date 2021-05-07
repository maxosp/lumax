import { createApiEffect } from '@/features/api/common/create-api-effect'
import { UpdateMediaType, UploadMediaResponse } from '@/features/api/media/types'

export const updateMediaFx = createApiEffect<UpdateMediaType, UploadMediaResponse>({
  requestMapper: (params) => ({
    method: 'PATCH',
    url: `/api/media-app/media/${params.id}/`,
    body: params,
  }),
})
