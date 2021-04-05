import { createApiEffect } from '@/features/api/common/create-api-effect'

export const deleteTagsFx = createApiEffect<number[], void>({
  requestMapper: (olympiad_tags) => ({
    method: 'PATCH',
    url: '/api/assignment/olympiad-tags/bulk-delete/',
    body: { olympiad_tags },
  }),
})
