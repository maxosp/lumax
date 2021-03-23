import { createApiEffect } from '@/features/api/common/create-api-effect'
import { LessonAssignment } from '@/features/api/assignment/types'

export const getLessonAssignmentFx = createApiEffect<number, LessonAssignment>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/assignment/lesson-assignment/${id}/`,
  }),
})
