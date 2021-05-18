import { createApiEffect } from '@/features/api/common/create-api-effect'
import { LessonAssignment } from '@/features/api/assignment/types/lesson-assignments-types'
import { CreateLessonAssignmentFxParams } from '@/features/api/assignment/types/types'

export const createLessonAssignmentFx = createApiEffect<
  CreateLessonAssignmentFxParams,
  LessonAssignment
>({
  requestMapper: (body) => ({
    method: 'POST',
    url: '/api/assignment-app/lesson-assignment/',
    body,
  }),
})
