import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateResourceType, Resource } from '@/features/api/media/types'

export const createResourceFx = createApiEffect<CreateResourceType, Resource>({
  requestMapper: (params) => ({
    method: 'POST',
    url: '/api/media/study-resource/',
    body: params,
  }),
})
