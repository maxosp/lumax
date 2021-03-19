import { createApiEffect } from '@/features/api/common/create-api-effect'
import { Ticket, UpdateTicketType } from '@/features/api/ticket/types'

export const updateTicketBulkFx = createApiEffect<UpdateTicketType, Ticket>({
  requestMapper: (body) => ({
    method: 'PATCH',
    url: '/appi/ticket/moderation-ticket/list/bulk-action/',
    body,
  }),
})
