import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TreeDataResponse } from '@/features/api/types'
import { GetThemesTreeQueryParams } from '@/features/api/subject/types'

export const getThemesTreeFx = createApiEffect<GetThemesTreeQueryParams, TreeDataResponse>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/subject-app/themes/tree/',
    query,
  }),
})

export const gethThemesTreeLightFx = createApiEffect<void, TreeDataResponse>({
  requestMapper: () => ({
    method: 'GET',
    url: '/api/subject-app/themes/tree/light/',
  }),
})
