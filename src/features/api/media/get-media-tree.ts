import { FiltersParams } from '@/pages/common/types'
import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TreeDataResponse } from '@/features/api/types'

export const getMediaTreeFx = createApiEffect<FiltersParams, TreeDataResponse>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/media-app/media/tree/',
    query,
  }),
})
