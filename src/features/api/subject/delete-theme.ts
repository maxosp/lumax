import { createApiEffect } from '@/features/api/common/create-api-effect'

export const deleteThemeFx = createApiEffect<number, void>({
  requestMapper: (id) => ({
    method: 'DELETE',
    url: `/api/subject/themes/${id}/`,
  }),
})
