import { createApiEffect } from '@/features/api/common/create-api-effect'
import { ExportAssignmentQueryParams } from '@/features/api/assignment/types/types'

export const exportOlympiadAssignmentListFx = createApiEffect<
  ExportAssignmentQueryParams,
  FileList
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/assignment-app/olympiad-assignment/list/export/',
    query,
  }),
})
