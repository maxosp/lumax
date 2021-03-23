import { createApiEffect } from '@/features/api/common/create-api-effect'
import { OlympiadAssignment } from '@/features/api/assignment/types'

export const getOlympiadAssignmentFx = createApiEffect<number, OlympiadAssignment>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/assignment/olympiad-assignment/${id}/`,
  }),
})
