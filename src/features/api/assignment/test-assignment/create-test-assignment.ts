import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateTestAssignmentFxParams, TestAssignment } from '@/features/api/assignment/types'

export const createTestAssignmentFx = createApiEffect<CreateTestAssignmentFxParams, TestAssignment>(
  {
    requestMapper: (body) => ({
      method: 'POST',
      url: '/api/assignment-app/test-assignment/',
      body,
    }),
  }
)
