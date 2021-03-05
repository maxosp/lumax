import { createApiEffect } from '@/features/api/common/create-api-effect'

export const deleteThemesFx = createApiEffect<number[], void>({
  requestMapper: (themes) => ({
    method: 'PATCH',
    url: '/api/subject/themes/bulk-delete/',
    body: { themes },
  }),
})
