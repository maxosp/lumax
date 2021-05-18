import { createApiEffect } from '@/features/api/common/create-api-effect'
import { FolderType } from '@/features/api/assignment/types/types'

export const getMediaFolderFx = createApiEffect<number, FolderType>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/media-app/media-folder/${id}/`,
  }),
})
