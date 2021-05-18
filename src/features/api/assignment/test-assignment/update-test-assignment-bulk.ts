import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TestAssignmentsBulkUpdate } from '@/features/api/assignment/types/test-assignments-types'
import { UpdateAssignmentsBulkFailResponse } from '@/features/api/assignment/types/types'

export const updateTestAssignmentBulkFx = createApiEffect<
  TestAssignmentsBulkUpdate,
  TestAssignmentsBulkUpdate,
  UpdateAssignmentsBulkFailResponse
>({
  requestMapper: (body) => ({
    method: 'PATCH',
    url: '/api/assignment-app/test-assignment/bulk-patch/',
    body,
  }),
})
