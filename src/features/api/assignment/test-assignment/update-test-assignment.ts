import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TestAssignment } from '@/features/api/assignment/types/test-assignments-types'
import { CreateTestAssignmentFxParams } from '@/features/api/assignment/types/types'

export const updateTestAssignmentFx = createApiEffect<
  { id: number; body: CreateTestAssignmentFxParams },
  TestAssignment
>({
  requestMapper: ({ id, body }) => ({
    method: 'PATCH',
    url: `/api/assignment-app/test-assignment/${id}/`,
    body,
  }),
})
