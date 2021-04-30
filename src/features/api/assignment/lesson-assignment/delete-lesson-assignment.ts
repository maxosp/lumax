import { createApiEffect } from '@/features/api/common/create-api-effect'
import { RequestDeleteAssignmentsParams } from '@/features/api/assignment/types'

export const deleteLessonAssignmentsFx = createApiEffect<number[], void>({
  requestMapper: (assignments) => ({
    method: 'PATCH',
    url: '/api/assignment-app/lesson-assignment/bulk-delete/',
    body: { assignments },
  }),
})

export const requestDeleteLessonAssignmentsFx = createApiEffect<
  RequestDeleteAssignmentsParams,
  RequestDeleteAssignmentsParams
>({
  requestMapper: (body) => ({
    method: 'PATCH',
    url: '/api/assignment-app/lesson-assignment/bulk-delete/',
    body,
  }),
})
