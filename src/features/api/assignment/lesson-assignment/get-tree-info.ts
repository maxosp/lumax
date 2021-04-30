import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TreeDataInfoResponse } from '@/features/api/types'

export const getLessonInfoFx = createApiEffect<void, TreeDataInfoResponse>({
  requestMapper: () => ({
    method: 'GET',
    url: '/api/assignment-app/lesson-assignment/tree/info/',
  }),
})
