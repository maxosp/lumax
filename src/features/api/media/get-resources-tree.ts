import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TreeDataResponse } from '@/features/api/types'
import { GetResourcesTreeQueryParams } from '@/features/api/media/types'

export const getResourcesTreeFx = createApiEffect<GetResourcesTreeQueryParams, TreeDataResponse>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/media-app/study-resources/tree/',
    query,
  }),
})
