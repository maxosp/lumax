import { createApiEffect } from '@/features/api/common/create-api-effect'
import { GetListQueryParams, TableDataResponse } from '@/features/api/types'
import { LessonAssignment } from '@/features/api/assignment/types/lesson-assignments-types'

export const getLessonAssignmentListFx = createApiEffect<
  GetListQueryParams,
  TableDataResponse<LessonAssignment[]>
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/assignment-app/lesson-assignment/list/',
    query,
  }),
})
