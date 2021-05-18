import { createApiEffect } from '@/features/api/common/create-api-effect'
import { OlympiadAssignmentsBulkUpdate } from '@/features/api/assignment/types/olympiad-assignments-types'
import { UpdateAssignmentsBulkFailResponse } from '@/features/api/assignment/types/types'

export const updateOlympiadAssignmentBulkFx = createApiEffect<
  OlympiadAssignmentsBulkUpdate,
  OlympiadAssignmentsBulkUpdate,
  UpdateAssignmentsBulkFailResponse
>({
  requestMapper: (body) => ({
    method: 'PATCH',
    url: '/api/assignment-app/olympiad-assignment/bulk-patch/',
    body,
  }),
})
