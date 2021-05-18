import { createApiEffect } from '@/features/api/common/create-api-effect'
import { LessonAssignment } from '@/features/api/assignment/types/lesson-assignments-types'

export const getLessonAssignmentFx = createApiEffect<number, LessonAssignment>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/assignment-app/lesson-assignment/${id}/`,
  }),
})
