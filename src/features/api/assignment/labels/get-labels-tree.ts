import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TreeDataResponse } from '@/features/api/types'
import { GetLabelsTreeQueryParams } from '@/features/api/assignment/types'

export const getLabelsTreeFx = createApiEffect<GetLabelsTreeQueryParams, TreeDataResponse>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/assignment/labels/tree/',
    query,
  }),
})
