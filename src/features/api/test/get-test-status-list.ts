import { createApiEffect } from '@/features/api/common/create-api-effect'
import { ListType } from '@/features/api/test/types'

export const getTestStatusListFx = createApiEffect<void, ListType[]>({
  requestMapper: () => ({
    method: 'GET',
    url: '/api/test-app/test/filter/statuses/',
  }),
})
