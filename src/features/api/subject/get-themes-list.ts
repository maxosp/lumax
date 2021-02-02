import { createApiEffect } from '@/features/api/common/create-api-effect'
import { GetThemesListQueryParams, TableDataResponse, Theme } from '@/features/api/subject/types'

export const getThemesListFx = createApiEffect<
  GetThemesListQueryParams,
  TableDataResponse<Theme[]>
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/subject/themes/list/',
    query,
  }),
})
