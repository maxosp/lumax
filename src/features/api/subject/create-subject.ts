import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateSubjectType, Subject } from '@/features/api/subject/types'

export const createSubjectFx = createApiEffect<Partial<CreateSubjectType>, Subject>({
  requestMapper: (params) => ({
    method: 'POST',
    url: '/api/subject/subjects/',
    body: params,
  }),
})
