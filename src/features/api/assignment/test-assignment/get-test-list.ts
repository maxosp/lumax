import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TreeDataResponse } from '@/features/api/types'
import { GetAssignmentTreeQueryParams } from '@/features/api/assignment/types'

export const getTestAssignmentListFx = createApiEffect<
  GetAssignmentTreeQueryParams,
  TreeDataResponse
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/assignment/test-assignment/list/',
    query,
  }),
})
