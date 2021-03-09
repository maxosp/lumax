import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateResourceType, ResourceType } from '@/features/api/media/types'

export const createResourceFx = createApiEffect<CreateResourceType, ResourceType>({
  requestMapper: (body) => ({
    method: 'POST',
    url: '/api/media/study-resource/',
    body,
  }),
})
