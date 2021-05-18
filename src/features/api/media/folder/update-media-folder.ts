import { createApiEffect } from '@/features/api/common/create-api-effect'
import { FolderType } from '@/features/api/assignment/types/types'

export const updateMediaFolderFx = createApiEffect<FolderType, FolderType>({
  requestMapper: (body) => ({
    method: 'PATCH',
    url: `/api/media-app/media-folder/${body.id}/`,
    body,
  }),
})
