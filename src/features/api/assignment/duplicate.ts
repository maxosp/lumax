import { createApiEffect } from '@/features/api/common/create-api-effect'
import { DuplicateAssignmentType } from '@/features/api/assignment/types'

export const duplicateAssignmentFx = createApiEffect<
  DuplicateAssignmentType,
  DuplicateAssignmentType
>({
  requestMapper: (params) => ({
    method: 'PATCH',
    url: '/api/assignment/assignments/duplicate/',
    body: params,
  }),
})
