import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateThemeType, Theme } from '@/features/api/subject/types'

export const updateThemeFx = createApiEffect<Partial<CreateThemeType>, Theme>({
  requestMapper: (params) => ({
    method: 'PATCH',
    url: `/api/subject/themes/${params.id}/`,
    body: params,
  }),
})
