import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateTagType, Tag } from '@/features/api/assignment/types'

export const createTagFx = createApiEffect<CreateTagType, Tag>({
  requestMapper: (params) => ({
    method: 'POST',
    url: '/api/assignment-app/olympiad-tags/',
    body: params,
  }),
})
