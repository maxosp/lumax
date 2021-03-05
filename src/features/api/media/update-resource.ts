import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateResourceType, Resource } from '@/features/api/media/types'

export const updateResourceFx = createApiEffect<Partial<CreateResourceType>, Resource>({
  requestMapper: (params) => ({
    method: 'PATCH',
    url: `/api/media/study-resource/${params.id}/`,
    body: params,
  }),
})
