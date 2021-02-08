import { createApiEffect } from '@/features/api/common/create-api-effect'
import { GetListQueryParams, TableDataResponse } from '@/features/api/types'
import { Subject } from '@/features/api/subject/types'

export const getSubjectsListFx = createApiEffect<GetListQueryParams, TableDataResponse<Subject[]>>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/subject/list/',
    query,
  }),
})
