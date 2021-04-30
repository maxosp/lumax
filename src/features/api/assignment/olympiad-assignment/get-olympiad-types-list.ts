import { createApiEffect } from '@/features/api/common/create-api-effect'
import { ListType } from '@/features/api/assignment/types'

export const getOlympiadTypesListFx = createApiEffect<void, ListType[]>({
  requestMapper: () => ({
    method: 'GET',
    url: `/api/assignment-app/olympiad-assignment/filter/types/`,
  }),
})
