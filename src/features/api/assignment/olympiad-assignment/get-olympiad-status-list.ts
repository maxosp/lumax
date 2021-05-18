import { createApiEffect } from '@/features/api/common/create-api-effect'
import { ListType } from '@/features/api/assignment/types/types'

export const getOlympiadStatusListFx = createApiEffect<void, ListType[]>({
  requestMapper: () => ({
    method: 'GET',
    url: '/api/assignment-app/olympiad-assignment/filter/statuses/',
  }),
})
