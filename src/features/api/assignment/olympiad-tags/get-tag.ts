import { createApiEffect } from '@/features/api/common/create-api-effect'
import { Tag } from '@/features/api/assignment/types'

export const getTagFx = createApiEffect<number, Tag>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/assignment-app/olympiad-tags/${id}/`,
  }),
})
