import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateFolderType, FolderType } from '@/features/api/assignment/types/types'

export const createFolderFx = createApiEffect<CreateFolderType, FolderType>({
  requestMapper: (params) => ({
    method: 'POST',
    url: '/api/assignment-app/folder/',
    body: params,
  }),
})
