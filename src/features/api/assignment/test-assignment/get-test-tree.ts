import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TreeDataResponse } from '@/features/api/types'
import { GetAssignmentTreeQueryParams } from '@/features/api/assignment/types/types'

export const getTestAssignmentTreeFx = createApiEffect<
  GetAssignmentTreeQueryParams,
  TreeDataResponse
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/assignment-app/test-assignment/tree/',
    query,
  }),
})
