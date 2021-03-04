import { createApiEffect } from '@/features/api/common/create-api-effect'

export const publishAssignmentFx = createApiEffect<number[], number[]>({
  requestMapper: (assignments) => ({
    method: 'PATCH',
    url: '/api/assignment/assignments/publish/',
    body: { assignments },
  }),
})
