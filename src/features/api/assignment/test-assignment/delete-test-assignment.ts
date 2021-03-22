import { createApiEffect } from '@/features/api/common/create-api-effect'

export const deleteTestAssignmentFx = createApiEffect<number, void>({
  requestMapper: (id) => ({
    method: 'DELETE',
    url: `/api/assignment/test-assignment/${id}/`,
  }),
})

export const deleteTestAssignmentsFx = createApiEffect<number[], number[]>({
  requestMapper: (assignments) => ({
    method: 'PATCH',
    url: '/api/assignment/test-assignments/bulk-delete/',
    body: { assignments },
  }),
})
