import { createApiEffect } from '@/features/api/common/create-api-effect'
import {
  CreateOlympiadAssignmentFxParams,
  OlympiadAssignment,
} from '@/features/api/assignment/types'

export const updateOlympiadAssignmentFx = createApiEffect<
  { id: number; body: CreateOlympiadAssignmentFxParams },
  OlympiadAssignment
>({
  requestMapper: ({ id, body }) => ({
    method: 'PUT',
    url: `/api/assignment/olympiad-assignment/${id}`,
    body,
  }),
})
