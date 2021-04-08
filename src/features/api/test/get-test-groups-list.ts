import { createApiEffect } from '@/features/api/common/create-api-effect'
import { ListType } from '@/features/api/test/types'

export const getTestGroupsListFx = createApiEffect<void, ListType[]>({
  requestMapper: () => ({
    method: 'GET',
    url: '/api/test/test/filter/groups_names/',
  }),
})
