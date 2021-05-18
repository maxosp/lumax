import { createApiEffect } from '@/features/api/common/create-api-effect'
import { LessonAssignmentsBulkUpdate } from '@/features/api/assignment/types/lesson-assignments-types'
import { UpdateAssignmentsBulkFailResponse } from '@/features/api/assignment/types/types'

export const updateLessonAssignmentBulkFx = createApiEffect<
  LessonAssignmentsBulkUpdate,
  LessonAssignmentsBulkUpdate,
  UpdateAssignmentsBulkFailResponse
>({
  requestMapper: (body) => ({
    method: 'PATCH',
    url: '/api/assignment-app/lesson-assignment/bulk-patch/',
    body,
  }),
})
