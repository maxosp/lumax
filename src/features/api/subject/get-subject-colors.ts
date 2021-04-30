import { createApiEffect } from '@/features/api/common/create-api-effect'
import { GetListQueryParams, TableDataResponse } from '@/features/api/types'
import { Icon } from '@/features/api/subject/types'

export const getColorsListFx = createApiEffect<GetListQueryParams, TableDataResponse<Icon[]>>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/subject-app/subject-colors/',
    query,
  }),
})
