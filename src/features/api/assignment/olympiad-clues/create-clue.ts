import { createApiEffect } from '@/features/api/common/create-api-effect'
import { Clue, CreateClueFxParams } from '@/features/api/assignment/types'

export const createClueFx = createApiEffect<CreateClueFxParams, Clue>({
  requestMapper: (params) => ({
    method: 'POST',
    url: '/api/assignment-app/olympiad-clues/',
    body: params,
  }),
})
