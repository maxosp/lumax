import { createApiEffect } from '@/features/api/common/create-api-effect'

export const deleteMediaFolderFx = createApiEffect<number, void>({
  requestMapper: (id) => ({
    method: 'DELETE',
    url: `/api/media-app/media-folder/${id}/`,
  }),
})
