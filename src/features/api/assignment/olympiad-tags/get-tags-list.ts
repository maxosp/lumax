import { createApiEffect } from '@/features/api/common/create-api-effect'
import { GetListQueryParams, TableDataResponse } from '@/features/api/types'
import { Tag } from '@/features/api/assignment/types/types'

export const getTagsListFx = createApiEffect<GetListQueryParams, TableDataResponse<Tag[]>>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/assignment-app/olympiad-tags/list/',
    query,
  }),
})
