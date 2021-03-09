import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TreeDataResponse } from '@/features/api/types'
import { GetTagsTreeQueryParams } from '@/features/api/assignment/types'

export const getTagsTreeLightFx = createApiEffect<GetTagsTreeQueryParams, TreeDataResponse>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/assignment/olympiad-tags/tree/light/',
    query,
  }),
})
