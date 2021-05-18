import { createApiEffect } from '@/features/api/common/create-api-effect'
import { OlympiadAssignment } from '@/features/api/assignment/types/olympiad-assignments-types'

export const getOlympiadAssignmentFx = createApiEffect<number, OlympiadAssignment>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/assignment-app/olympiad-assignment/${id}/`,
  }),
})
