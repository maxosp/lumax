import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TreeLightDataResponse } from '@/features/api/types'
import { GetAssignmentTreeQueryParams } from '@/features/api/assignment/types'

export const getLessonAssignmentTreeLightFx = createApiEffect<
  GetAssignmentTreeQueryParams,
  TreeLightDataResponse
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/assignment/lesson-assignment/tree/light/',
    query,
  }),
})
