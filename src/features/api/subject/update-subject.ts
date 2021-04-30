import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateSubjectType, Subject } from '@/features/api/subject/types'

export const updateSubjectFx = createApiEffect<Partial<CreateSubjectType>, Subject>({
  requestMapper: (params) => ({
    method: 'PUT',
    url: `/api/subject-app/subjects/${params.id}/`,
    body: params,
  }),
})
