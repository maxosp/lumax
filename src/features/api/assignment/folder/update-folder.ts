import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateFolderType, FolderType } from '@/features/api/assignment/types/types'

export const updateFolderFx = createApiEffect<{ id: number; body: CreateFolderType }, FolderType>({
  requestMapper: ({ id, body }) => ({
    method: 'PATCH',
    url: `/api/assignment-app/folder/${id}/`,
    body,
  }),
})
