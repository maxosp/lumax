import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TestAssignment } from '@/features/api/assignment/types/test-assignments-types'

export const getTestAssignmentFx = createApiEffect<number, TestAssignment>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/assignment-app/test-assignment/${id}/`,
  }),
})
