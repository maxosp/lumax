import { createApiEffect } from '@/features/api/common/create-api-effect'

export const deleteLabelsFx = createApiEffect<number[], void>({
  requestMapper: (labels) => ({
    method: 'PATCH',
    url: '/api/assignment/labels/bulk-delete/',
    body: { labels },
  }),
})
