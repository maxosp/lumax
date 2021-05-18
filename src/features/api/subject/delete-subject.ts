import { createApiEffect } from '@/features/api/common/create-api-effect'
import { RequestDeleteSubjectsParams } from '@/features/api/assignment/types/types'

export const deleteSubjectsFx = createApiEffect<number[], void>({
  requestMapper: (subjects) => ({
    method: 'PATCH',
    url: '/api/subject-app/subjects/bulk-delete/',
    body: { subjects },
  }),
})

export const requestDeleteSubjectsFx = createApiEffect<
  RequestDeleteSubjectsParams,
  RequestDeleteSubjectsParams
>({
  requestMapper: (body) => ({
    method: 'PATCH',
    url: '/api/subject-app/subjects/bulk-delete/',
    body,
  }),
})
