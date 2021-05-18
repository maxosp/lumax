import { createApiEffect } from '@/features/api/common/create-api-effect'
import { ModerationTicket } from '@/features/api/ticket/types'

export const getTicketFx = createApiEffect<number, ModerationTicket>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/ticket-app/deletion-ticket/${id}/`,
  }),
})
