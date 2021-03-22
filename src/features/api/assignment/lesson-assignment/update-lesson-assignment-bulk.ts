import { createApiEffect } from '@/features/api/common/create-api-effect'
import { OlympiadAssignment, UpdateAssignmentsBulkParams } from '@/features/api/assignment/types'

export const updateLessonAssignmentBulkFx = createApiEffect<
  UpdateAssignmentsBulkParams,
  OlympiadAssignment
>({
  requestMapper: (body) => ({
    method: 'PATCH',
    url: '/api/assignment/lesson-assignment/bulk-patch/',
    body,
  }),
})
