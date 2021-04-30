import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TreeDataInfoResponse } from '@/features/api/types'

export const getTagsInfoFx = createApiEffect<void, TreeDataInfoResponse>({
  requestMapper: () => ({
    method: 'GET',
    url: '/api/assignment-app/olympiad-tags/tree/info/',
  }),
})
