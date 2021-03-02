import { createApiEffect } from '@/features/api/common/create-api-effect'
import { DeleteTagsType } from '@/features/api/assignment/types'

export const deleteTagsFx = createApiEffect<DeleteTagsType, void>({
  requestMapper: (params) => ({
    method: 'PATCH',
    url: `/api/assignment/olympiad-tags/bulk-delete/`,
    body: params,
  }),
})
