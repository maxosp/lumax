import { createApiEffect } from '@/features/api/common/create-api-effect'

export const deleteLessonAssignmentFx = createApiEffect<number, void>({
  requestMapper: (id) => ({
    method: 'DELETE',
    url: `/api/assignment/lesson-assignment/${id}/`,
  }),
})

export const deleteLessonAssignmentsFx = createApiEffect<number[], number[]>({
  requestMapper: (assignments) => ({
    method: 'PATCH',
    url: '/api/assignment/lesson-assignments/bulk-delete/',
    body: { assignments },
  }),
})
