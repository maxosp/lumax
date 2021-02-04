import { createApiEffect } from '@/features/api/common/create-api-effect'
import { GetUserFxResponse } from '@/features/api/user/types'

export const getSelfUserFx = createApiEffect<void, GetUserFxResponse>({
  requestMapper: () => ({
    method: 'GET',
    url: `/api/user/me/`,
  }),
})
