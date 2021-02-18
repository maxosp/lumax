import { createApiEffect } from '@/features/api/common/create-api-effect'
import { GetListQueryParams, GetThemeTreeFilterListResponse } from '@/features/api/types'

export const getThemesTreeListFx = createApiEffect<
  GetListQueryParams,
  GetThemeTreeFilterListResponse[]
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/subject/themes/filter-tree/',
    query,
  }),
})
