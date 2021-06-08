import { createApiEffect } from '@/features/api/common/create-api-effect'
import { GetListQueryParams, TableDataResponse } from '@/features/api/types'
import { TestAssignment } from '@/features/api/assignment/types/test-assignments-types'

export const getTestAssignmentListFx = createApiEffect<
  GetListQueryParams,
  TableDataResponse<TestAssignment[]>
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/assignment-app/test-assignment/list/',
    query,
  }),
})
