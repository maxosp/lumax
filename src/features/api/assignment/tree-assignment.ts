import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TreeLightDataResponse } from '@/features/api/types'
import { GetAssignmentTreeQueryParams } from '@/features/api/assignment/types'

export const getAssignmentTreeFx = createApiEffect<
  GetAssignmentTreeQueryParams,
  TreeLightDataResponse
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/assignment/assignment/tree/',
    query,
  }),
})

export const getAssignmentTreeLightFx = createApiEffect<
  GetAssignmentTreeQueryParams,
  TreeLightDataResponse
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/assignment/assignment/tree/light/',
    query,
  }),
})
