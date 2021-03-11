import { createApiEffect } from '@/features/api/common/create-api-effect'
import { SendToModerationParams } from './types'

export const sendToModerationAssignmentFx = createApiEffect<SendToModerationParams, number[]>({
  requestMapper: (params) => ({
    method: 'PATCH',
    url: '/api/assignment/assignments/send-to-moderation/',
    body: params,
  }),
})
