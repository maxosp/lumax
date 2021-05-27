import { createApiEffect } from '@/features/api/common/create-api-effect'
import { ResourceType } from '@/features/api/media/types'
import { FiltersParams } from '@/pages/common/types'
import { TableDataResponse } from '@/features/api/types'

export const getResourcesListFx = createApiEffect<FiltersParams, TableDataResponse<ResourceType[]>>(
  {
    requestMapper: (query) => ({
      method: 'GET',
      url: '/api/media-app/study-resources/list/',
      query,
    }),
  }
)
