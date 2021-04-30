import { createApiEffect } from '@/features/api/common/create-api-effect'
import { Subject } from '@/features/api/subject/types'

export const getSubjectFx = createApiEffect<number, Subject>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/subject-app/subjects/${id}/`,
  }),
})
