import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TreeDataResponse } from '@/features/api/types'

export const getTagsTreeLightFx = createApiEffect<void, TreeDataResponse>({
  requestMapper: () => ({
    method: 'GET',
    url: '/api/assignment-app/olympiad-tags/tree/light/',
  }),
})
