import { createApiEffect } from '@/features/api/common/create-api-effect'
import { GetListQueryParams } from '../types'

export const getThemesTreeListFx = createApiEffect<GetListQueryParams, any>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/subject/themes/filter-tree/',
    query,
  }),
})
