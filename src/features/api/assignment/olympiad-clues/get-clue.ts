import { createApiEffect } from '@/features/api/common/create-api-effect'
import { Clue } from '@/features/api/assignment/types'

export const getClueFx = createApiEffect<number, Clue>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/assignment-app/olympiad-clues/${id}/`,
  }),
})
