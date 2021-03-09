import { createApiEffect } from '@/features/api/common/create-api-effect'

export const deleteLabelFx = createApiEffect<number, void>({
  requestMapper: (id) => ({
    method: 'DELETE',
    url: `/api/assignment/labels/${id}/`,
  }),
})
