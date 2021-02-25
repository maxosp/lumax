import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateSubjectType, Subject } from '@/features/api/subject/types'

export const updateSubjectFx = createApiEffect<Partial<CreateSubjectType>, Subject>({
  requestMapper: (params) => ({
    method: 'PUT',
    url: `/api/subject/subjects/${params.id}/`,
    body: params,
  }),
})
