import { createApiEffect } from '@/features/api/common/create-api-effect'
import { ModerationTicket, UpdateTicketType } from '@/features/api/ticket/types'

export const updateTicketFx = createApiEffect<UpdateTicketType, ModerationTicket>({
  requestMapper: (body) => ({
    method: 'PATCH',
    url: `/api/ticket-app/moderation-ticket/${body.id}`,
    body,
  }),
})
