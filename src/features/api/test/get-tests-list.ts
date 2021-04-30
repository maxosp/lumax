import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TableDataResponse } from '@/features/api/types'
import { GetTestsListQueryParams, TestList } from '@/features/api/test/types'

export const getTestsListFx = createApiEffect<
  GetTestsListQueryParams,
  TableDataResponse<TestList[]>
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/test-app/test/list/',
    query,
  }),
})
