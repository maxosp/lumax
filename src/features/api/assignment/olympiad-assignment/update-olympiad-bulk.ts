import { createApiEffect } from '@/features/api/common/create-api-effect'
import { OlympiadAssignment, UpdateAssignmentsBulkParams } from '@/features/api/assignment/types'

export const updateOlympiadAssignmentBulkFx = createApiEffect<
  UpdateAssignmentsBulkParams,
  OlympiadAssignment
>({
  requestMapper: (body) => ({
    method: 'PATCH',
    url: '/api/assignment-app/olympiad-assignment/bulk-patch/',
    body,
  }),
})
