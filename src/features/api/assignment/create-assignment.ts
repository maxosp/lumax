import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateAssignmentFxParams, Assignment } from '@/features/api/assignment/types'

export const createAssignmentFx = createApiEffect<CreateAssignmentFxParams, Assignment>({
  requestMapper: (body) => ({
    method: 'POST',
    url: '/api/assignment/assignments/',
    body,
  }),
})
