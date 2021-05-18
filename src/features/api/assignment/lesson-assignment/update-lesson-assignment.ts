import { createApiEffect } from '@/features/api/common/create-api-effect'
import { LessonAssignment } from '@/features/api/assignment/types/lesson-assignments-types'
import { CreateLessonAssignmentFxParams } from '@/features/api/assignment/types/types'

export const updateLessonAssignmentFx = createApiEffect<
  { id: number; body: CreateLessonAssignmentFxParams },
  LessonAssignment
>({
  requestMapper: ({ id, body }) => ({
    method: 'PATCH',
    url: `/api/assignment-app/lesson-assignment/${id}/`,
    body,
  }),
})
