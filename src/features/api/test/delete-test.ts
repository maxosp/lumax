import { createApiEffect } from '@/features/api/common/create-api-effect'
import { RequestDeleteTestsParams } from '@/features/api/test/types'

export const deleteTestFx = createApiEffect<number[], void>({
  requestMapper: (tests) => ({
    method: 'PATCH',
    url: '/api/test-app/test/list/bulk-delete/',
    body: { tests },
  }),
})

export const requestDeleteTestsFx = createApiEffect<
  RequestDeleteTestsParams,
  RequestDeleteTestsParams
>({
  requestMapper: (body) => ({
    method: 'PATCH',
    url: '/api/test-app/test/list/bulk-delete/',
    body,
  }),
})
