import { createApiEffect } from '@/features/api/common/create-api-effect'

export const deleteResourceFx = createApiEffect<number, void>({
  requestMapper: (id) => ({
    method: 'DELETE',
    url: `/api/media/study-resource/${id}/`,
  }),
})
