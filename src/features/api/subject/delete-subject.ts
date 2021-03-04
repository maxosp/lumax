import { createApiEffect } from '@/features/api/common/create-api-effect'

export const deleteSubjectFx = createApiEffect<number, void>({
  requestMapper: (id) => ({
    method: 'DELETE',
    url: `/api/subject/subjects/${id}/`,
  }),
})

export const deleteSubjectsFx = createApiEffect<number[], number[]>({
  requestMapper: (subjects) => ({
    method: 'PATCH',
    url: '/api/subject/subjects/bulk-delete/',
    body: { subjects },
  }),
})
