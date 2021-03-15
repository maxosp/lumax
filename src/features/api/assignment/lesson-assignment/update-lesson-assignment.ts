import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateLessonAssignmentFxParams, LessonAssignment } from '@/features/api/assignment/types'

export const updateLessonAssignmentFx = createApiEffect<
  { id: number; body: CreateLessonAssignmentFxParams },
  LessonAssignment
>({
  requestMapper: ({ id, body }) => ({
    method: 'PUT',
    url: `/api/assignment/lesson-assignment/${id}`,
    body,
  }),
})
