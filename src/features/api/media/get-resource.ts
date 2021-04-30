import { createApiEffect } from '@/features/api/common/create-api-effect'
import { ResourceType } from '@/features/api/media/types'

export const getResourceFx = createApiEffect<number, ResourceType>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/media-app/study-resource/${id}/`,
  }),
})
