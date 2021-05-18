import { createApiEffect } from '@/features/api/common/create-api-effect'
import { OlympiadAssignment } from '@/features/api/assignment/types/olympiad-assignments-types'
import { CreateOlympiadAssignmentFxParams } from '@/features/api/assignment/types/types'

export const createOlympiadAssignmentFx = createApiEffect<
  CreateOlympiadAssignmentFxParams,
  OlympiadAssignment
>({
  requestMapper: (body) => ({
    method: 'POST',
    url: '/api/assignment-app/olympiad-assignment/',
    body,
  }),
})
