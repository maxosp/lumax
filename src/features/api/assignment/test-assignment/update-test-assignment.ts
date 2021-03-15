import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateTestAssignmentFxParams, TestAssignment } from '@/features/api/assignment/types'

export const updateTestAssignmentFx = createApiEffect<
  { id: number; body: CreateTestAssignmentFxParams },
  TestAssignment
>({
  requestMapper: ({ id, body }) => ({
    method: 'PUT',
    url: `/api/assignment/test-assignment/${id}`,
    body,
  }),
})
