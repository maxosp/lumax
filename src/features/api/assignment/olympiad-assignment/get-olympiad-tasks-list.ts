import { createApiEffect } from '@/features/api/common/create-api-effect'
import { GetListQueryParams, TableDataResponse } from '@/features/api/types'
import { OlympiadAssignment } from '@/features/api/assignment/types'

export const getOlympiadTasksListFx = createApiEffect<
  GetListQueryParams,
  TableDataResponse<OlympiadAssignment[]>
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/assignment/olympiad-assignment/list/',
    query,
  }),
})
