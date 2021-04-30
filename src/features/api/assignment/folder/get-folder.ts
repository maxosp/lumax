import { createApiEffect } from '@/features/api/common/create-api-effect'
import { FolderType } from '@/features/api/assignment/types'

export const getFolderFx = createApiEffect<number, FolderType>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/assignment-app/folder/${id}/`,
  }),
})
