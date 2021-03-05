import { createApiEffect } from '@/features/api/common/create-api-effect'
import { Resource } from '@/features/api/media/types'

export const getResourceFx = createApiEffect<number, Resource>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/media/study-resource/${id}/`,
  }),
})
