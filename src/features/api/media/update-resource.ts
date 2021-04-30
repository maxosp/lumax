import { createApiEffect } from '@/features/api/common/create-api-effect'
import { ResourceType } from '@/features/api/media/types'

export const updateResourceFx = createApiEffect<ResourceType, ResourceType>({
  requestMapper: (params) => ({
    method: 'PATCH',
    url: `/api/media-app/study-resource/${params.id}/`,
    body: params,
  }),
})
