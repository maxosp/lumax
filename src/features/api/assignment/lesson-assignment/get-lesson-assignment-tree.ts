import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TreeDataResponse } from '@/features/api/types'
import { FiltersParams } from '@/pages/common/types'

export const getLessonAssignmentTreeFx = createApiEffect<FiltersParams, TreeDataResponse>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/assignment-app/lesson-assignment/tree/',
    query,
  }),
})
