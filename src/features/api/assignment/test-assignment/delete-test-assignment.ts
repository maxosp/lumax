import { createApiEffect } from '@/features/api/common/create-api-effect'
import { RequestDeleteAssignmentsParams } from '@/features/api/assignment/types'

export const deleteTestAssignmentsFx = createApiEffect<number[], number[]>({
  requestMapper: (assignments) => ({
    method: 'PATCH',
    url: '/api/assignment/test-assignment/bulk-delete/',
    body: { assignments },
  }),
})

export const requestDeleteTestAssignmentsFx = createApiEffect<
  RequestDeleteAssignmentsParams,
  RequestDeleteAssignmentsParams
>({
  requestMapper: (body) => ({
    method: 'PATCH',
    url: '/api/assignment/test-assignment/bulk-delete/',
    body,
  }),
})
