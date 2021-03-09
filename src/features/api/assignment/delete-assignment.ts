import { createApiEffect } from '@/features/api/common/create-api-effect'

export const deleteAssignmentFx = createApiEffect<number, void>({
  requestMapper: (id) => ({
    method: 'DELETE',
    url: `/api/assignment/assignments/${id}/`,
  }),
})

export const deleteAssignmentsFx = createApiEffect<number[], number[]>({
  requestMapper: (assignments) => ({
    method: 'PATCH',
    url: '/api/assignment/assignments/bulk-delete/',
    body: { assignments },
  }),
})
