import { createApiEffect } from '@/features/api/common/create-api-effect'
import { ListType } from '@/features/api/assignment/types'

export const getTestLanguageListFx = createApiEffect<void, ListType[]>({
  requestMapper: () => ({
    method: 'GET',
    url: `/api/assignment/test-assignment/filter/language/`,
  }),
})
