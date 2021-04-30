import { createApiEffect } from '@/features/api/common/create-api-effect'
import { RequestDeleteAssignmentsParams } from '@/features/api/assignment/types'

export const deleteOlympiadAssignmentsFx = createApiEffect<number[], void>({
  requestMapper: (assignments) => ({
    method: 'PATCH',
    url: '/api/assignment-app/olympiad-assignment/bulk-delete/',
    body: { assignments },
  }),
})

export const requestDeleteOlympiadAssignmentsFx = createApiEffect<
  RequestDeleteAssignmentsParams,
  RequestDeleteAssignmentsParams
>({
  requestMapper: (body) => ({
    method: 'PATCH',
    url: '/api/assignment-app/olympiad-assignment/bulk-delete/',
    body,
  }),
})
