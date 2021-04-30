import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateTagType, Tag } from '@/features/api/assignment/types'

export const updateTagFx = createApiEffect<CreateTagType, Tag>({
  requestMapper: (params) => ({
    method: 'PUT',
    url: `/api/assignment-app/olympiad-tags/${params.id}/`,
    body: params,
  }),
})
