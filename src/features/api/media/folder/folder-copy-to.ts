import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CopyToFolderType, UploadMediaResponse } from '@/features/api/media/types'

export const mediaFolderCopyToFx = createApiEffect<CopyToFolderType, UploadMediaResponse>({
  requestMapper: (params) => ({
    method: 'POST',
    url: '/api/media-app/media-folder/copy-to/',
    body: params,
  }),
})
