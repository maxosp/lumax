import { createApiEffect } from '@/features/api/common/create-api-effect'
import { OlympiadAssignment } from '@/features/api/assignment/types/olympiad-assignments-types'
import { CreateOlympiadAssignmentFxParams } from '@/features/api/assignment/types/types'

export const updateOlympiadAssignmentFx = createApiEffect<
  { id: number; body: CreateOlympiadAssignmentFxParams },
  OlympiadAssignment
>({
  requestMapper: ({ id, body }) => ({
    method: 'PATCH',
    url: `/api/assignment-app/olympiad-assignment/${id}/`,
    body,
  }),
})
