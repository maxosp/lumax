import { createApiEffect } from '@/features/api/common/create-api-effect'
import { Label } from '@/features/api/assignment/types'

export const getLabelFx = createApiEffect<number, Label>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/assignment/labels/${id}/`,
  }),
})
