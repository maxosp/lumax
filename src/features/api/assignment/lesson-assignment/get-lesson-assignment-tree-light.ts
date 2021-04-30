import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TreeDataResponse } from '@/features/api/types'

export const getLessonAssignmentTreeLightFx = createApiEffect<void, TreeDataResponse>({
  requestMapper: () => ({
    method: 'GET',
    url: '/api/assignment-app/lesson-assignment/tree/light/',
  }),
})
