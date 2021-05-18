import { createApiEffect } from '@/features/api/common/create-api-effect'
import { RequestDeleteFolderParams } from '@/features/api/assignment/types/types'

export const deleteFolderFx = createApiEffect<number, void>({
  requestMapper: (id) => ({
    method: 'DELETE',
    url: `/api/assignment-app/folder/${id}/`,
  }),
})

export const requestDeleteFolderFx = createApiEffect<
  RequestDeleteFolderParams,
  RequestDeleteFolderParams
>({
  requestMapper: (body) => ({
    method: 'PATCH',
    url: '/api/assignment-app/folder/bulk-delete/',
    body,
  }),
})
