import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TestAssignment } from '@/features/api/assignment/types/test-assignments-types'
import { CreateTestAssignmentFxParams } from '@/features/api/assignment/types/types'

export const createTestAssignmentFx = createApiEffect<CreateTestAssignmentFxParams, TestAssignment>(
  {
    requestMapper: (body) => ({
      method: 'POST',
      url: '/api/assignment-app/test-assignment/',
      body,
    }),
  }
)
