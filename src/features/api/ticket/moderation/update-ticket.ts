import { createApiEffect } from '@/features/api/common/create-api-effect'
import { Ticket, UpdateTicketType } from '@/features/api/ticket/types'

export const updateTicketFx = createApiEffect<UpdateTicketType, Ticket>({
  requestMapper: (body) => ({
    method: 'PATCH',
    url: `/api/ticket-app/moderation-ticket/${body.id}`,
    body,
  }),
})
