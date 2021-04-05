import { createApiEffect } from '@/features/api/common/create-api-effect'

export const deleteResourcesFx = createApiEffect<number[], void>({
  requestMapper: (study_resources) => ({
    method: 'PATCH',
    url: '/api/media/study-resources/list/bulk-delete/',
    body: { study_resources },
  }),
})
