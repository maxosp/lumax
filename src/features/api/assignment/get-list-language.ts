import { createApiEffect } from '@/features/api/common/create-api-effect'
import { ListType } from '@/features/api/assignment/types'

export const getListLanguageFx = createApiEffect<void, ListType[]>({
  requestMapper: () => ({
    method: 'GET',
    url: `/api/assignment/assignments-filter/language/`,
  }),
})
