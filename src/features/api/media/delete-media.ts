import { createApiEffect } from '@/features/api/common/create-api-effect'

export const deleteMediaFx = createApiEffect<number, void>({
  requestMapper: (id) => ({
    method: 'DELETE',
    url: `/api/media/${id}/`,
  }),
})
