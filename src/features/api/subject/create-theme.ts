import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateThemeType, Theme } from '@/features/api/subject/types'

export const createThemeFx = createApiEffect<Partial<CreateThemeType>, Theme>({
  requestMapper: (params) => ({
    method: 'POST',
    url: `/api/subject/themes/`,
    body: params,
  }),
})
