import { createApiEffect } from '@/features/api/common/create-api-effect'
import { Theme } from '@/features/api/subject/types'

export const getThemeFx = createApiEffect<number, Theme>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/subject-app/themes/${id}/`,
  }),
})
