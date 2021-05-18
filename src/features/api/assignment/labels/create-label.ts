import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateLabelType, Label } from '@/features/api/assignment/types/types'

export const createLabelFx = createApiEffect<CreateLabelType, Label>({
  requestMapper: (params) => ({
    method: 'POST',
    url: '/api/assignment-app/labels/',
    body: params,
  }),
})
