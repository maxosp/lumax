import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateFolderType, FolderType } from '@/features/api/assignment/types'

export const createMediaFolderFx = createApiEffect<CreateFolderType, FolderType>({
  requestMapper: (body) => ({
    method: 'POST',
    url: '/api/media-app/media-folder/',
    body,
  }),
})
