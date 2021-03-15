import { createApiEffect } from '@/features/api/common/create-api-effect'
import { ListType } from '@/features/api/assignment/types'

export const getOlympiadDifficultyListFx = createApiEffect<void, ListType[]>({
  requestMapper: () => ({
    method: 'GET',
    url: '/api/assignment/olympiad-assignment/filter/difficulty/',
  }),
})
