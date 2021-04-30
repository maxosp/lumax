import { createApiEffect } from '@/features/api/common/create-api-effect'
import { GetListQueryParams, TableDataResponse } from '@/features/api/types'
import { Theme } from '@/features/api/subject/types'

export const getThemesListFx = createApiEffect<GetListQueryParams, TableDataResponse<Theme[]>>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/subject-app/themes/list/',
    query,
  }),
})
