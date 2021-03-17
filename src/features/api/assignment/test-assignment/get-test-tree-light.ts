import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TreeLightDataResponse } from '@/features/api/types'
import { GetAssignmentTreeQueryParams } from '@/features/api/assignment/types'

export const getTestAssignmentTreeLightFx = createApiEffect<
  GetAssignmentTreeQueryParams,
  TreeLightDataResponse
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/assignment/test-assignment/tree/light/',
    query,
  }),
})
