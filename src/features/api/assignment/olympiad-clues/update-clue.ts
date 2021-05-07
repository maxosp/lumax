import { createApiEffect } from '@/features/api/common/create-api-effect'
import { Clue, CreateClueFxParams } from '@/features/api/assignment/types'

export const updateClueFx = createApiEffect<{ id: number | null; data: CreateClueFxParams }, Clue>({
  requestMapper: (params) => ({
    method: 'PATCH',
    url: `/api/assignment-app/olympiad-clues/${params.id}/`,
    body: params.data,
  }),
})
