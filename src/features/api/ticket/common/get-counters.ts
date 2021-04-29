import { createApiEffect } from '@/features/api/common/create-api-effect'
import { GetApplicationsCountersResponse } from '@/features/api/types'

export const getApplicationsCountersFx = createApiEffect<void, GetApplicationsCountersResponse>({
  requestMapper: () => ({
    method: 'GET',
    url: '/api/ticket/deletion-moderation-tickets-count/get/',
  }),
})
