import { createApiEffect } from '@/features/api/common/create-api-effect'
import { User } from '@/features/api/user/types'

export const getSelfUserFx = createApiEffect<void, User>({
  requestMapper: () => ({
    method: 'GET',
    url: `/api/user-app/me/`,
  }),
})
