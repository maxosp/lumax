import { createApiEffect } from '@/features/api/common/create-api-effect'

export const deleteOlympiadAssignmentFx = createApiEffect<number, void>({
  requestMapper: (id) => ({
    method: 'DELETE',
    url: `/api/assignment/olympiad-assignment/${id}`,
  }),
})

export const deleteOlympiadAssignmentsFx = createApiEffect<number[], number[]>({
  requestMapper: (assignments) => ({
    method: 'PATCH',
    url: '/api/assignment/olympiad-assignments/bulk-delete/',
    body: { assignments },
  }),
})
