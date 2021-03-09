import { createApiEffect } from '@/features/api/common/create-api-effect'
import { GetListQueryParams, TableDataResponse } from '@/features/api/types'
import { Assignment } from '@/features/api/assignment/types'

export const getOlympiadTasksListFx = createApiEffect<
  GetListQueryParams,
  TableDataResponse<Assignment[]>
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/assignment/assignment-olympiad/list/',
    query,
  }),
})
