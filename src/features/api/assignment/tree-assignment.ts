import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TreeDataResponse, TreeLightDataResponse } from '@/features/api/types'
import { GetAssignmentTreeQueryParams } from '@/features/api/assignment/types/types'

export const getAssignmentTreeFx = createApiEffect<GetAssignmentTreeQueryParams, TreeDataResponse>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/assignment-app/assignment/tree/',
    query,
  }),
})

export const getAssignmentTreeLightFx = createApiEffect<
  GetAssignmentTreeQueryParams,
  TreeLightDataResponse
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/assignment-app/assignment/tree/light/',
    query,
  }),
})
