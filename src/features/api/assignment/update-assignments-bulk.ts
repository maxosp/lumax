import { createApiEffect } from '@/features/api/common/create-api-effect'
import { UpdateAssignmentsBulkParams } from '@/features/api/assignment/types'

export const updateAssignmentsBulkFx = createApiEffect<UpdateAssignmentsBulkParams, void>({
  requestMapper: (params) => ({
    method: 'PATCH',
    url: '/api/assignment/assignments/bulk-patch/',
    body: params,
  }),
})
