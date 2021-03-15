import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateLessonAssignmentFxParams, LessonAssignment } from '@/features/api/assignment/types'

export const createLessonAssignmentFx = createApiEffect<
  CreateLessonAssignmentFxParams,
  LessonAssignment
>({
  requestMapper: (body) => ({
    method: 'POST',
    url: '/api/assignment/lesson-assignment/',
    body,
  }),
})
