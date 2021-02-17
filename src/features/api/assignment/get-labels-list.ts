import { createApiEffect } from '@/features/api/common/create-api-effect'
import { GetListQueryParams, TableDataResponse } from '@/features/api/types'
import { Label } from '@/features/api/assignment/types'

export const getLabelsListFx = createApiEffect<GetListQueryParams, TableDataResponse<Label[]>>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/assignment/labels/list/',
    query,
  }),
})
