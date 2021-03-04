import { createApiEffect } from '@/features/api/common/create-api-effect'

export const sendToModerationAssignmentFx = createApiEffect<number[], number[]>({
  requestMapper: (assignments) => ({
    method: 'PATCH',
    url: '/api/assignment/assignments/send-to-moderation/',
    body: { assignments },
  }),
})
