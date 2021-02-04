import { createApiEffect } from '@/features/api/common/create-api-effect'
import { LoginFxParams, LoginFxResponse } from '@/features/api/user/types'

export const loginFx = createApiEffect<LoginFxParams, LoginFxResponse>({
  requestMapper: (params) => ({
    method: 'POST',
    url: '/api/user/token/',
    body: params,
  }),
})
