import { createApiEffect } from '@/features/api/common/create-api-effect'
import {
  CreateOlympiadAssignmentFxParams,
  OlympiadAssignment,
} from '@/features/api/assignment/types'

export const createOlympiadAssignmentFx = createApiEffect<
  CreateOlympiadAssignmentFxParams,
  OlympiadAssignment
>({
  requestMapper: (body) => ({
    method: 'POST',
    url: '/api/assignment/olympiad-assignment/',
    body,
  }),
})
