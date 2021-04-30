import { createApiEffect } from '@/features/api/common/create-api-effect'
import { RequestDeleteThemesParams } from '@/features/api/assignment/types'

export const deleteThemesFx = createApiEffect<number[], void>({
  requestMapper: (themes) => ({
    method: 'PATCH',
    url: '/api/subject-app/themes/bulk-delete/',
    body: { themes },
  }),
})

export const requestDeleteThemesFx = createApiEffect<
  RequestDeleteThemesParams,
  RequestDeleteThemesParams
>({
  requestMapper: (body) => ({
    method: 'PATCH',
    url: '/api/subject-app/themes/bulk-delete/',
    body,
  }),
})
