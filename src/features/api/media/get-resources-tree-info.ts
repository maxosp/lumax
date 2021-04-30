import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TreeDataInfoResponse } from '@/features/api/types'

export const getResourcesInfoFx = createApiEffect<void, TreeDataInfoResponse>({
  requestMapper: () => ({
    method: 'GET',
    url: '/api/media-app/study-resources/tree/info/',
  }),
})
