import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TreeDataResponse } from '@/features/api/types'

export const getResourcesTreeLightFx = createApiEffect<void, TreeDataResponse>({
  requestMapper: () => ({
    method: 'GET',
    url: '/api/media-app/study-resources/tree/light/',
  }),
})
