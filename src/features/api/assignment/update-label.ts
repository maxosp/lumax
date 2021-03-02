import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateLabelType, Label } from '@/features/api/assignment/types'

export const updateLabelFx = createApiEffect<CreateLabelType, Label>({
  requestMapper: (params) => ({
    method: 'PUT',
    url: `/api/assignment/labels/${params.id}/`,
    body: params,
  }),
})
