import { createApiEffect } from '@/features/api/common/create-api-effect'
import { DeleteTagsType } from '@/features/api/assignment/types'

export const deleteTagFx = createApiEffect<number, void>({
  requestMapper: (id) => ({
    method: 'DELETE',
    url: `/api/assignment/olympiad-tags/${id}/`,
  }),
})

export const deleteTagsFx = createApiEffect<DeleteTagsType, void>({
  requestMapper: (params) => ({
    method: 'PATCH',
    url: '/api/assignment/olympiad-tags/bulk-delete/',
    body: params,
  }),
})
