import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CheckBeforeDeletionResponseType } from '@/features/api/ticket/types'

export const checkBeforeDeletionFx = createApiEffect<number, CheckBeforeDeletionResponseType>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/ticket-app/deletion-ticket/${id}/check/`,
  }),
})
