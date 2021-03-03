import { createApiEffect } from '@/features/api/common/create-api-effect'

export const deleteTagFx = createApiEffect<number, void>({
  requestMapper: (id) => ({
    method: 'DELETE',
    url: `/api/assignment/olympiad-tags/${id}/`,
  }),
})
