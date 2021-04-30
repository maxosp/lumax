import { createApiEffect } from '@/features/api/common/create-api-effect'
import { Ticket, UpdateTicketBulkType } from '@/features/api/ticket/types'

export const updateTicketBulkFx = createApiEffect<UpdateTicketBulkType, Ticket>({
  requestMapper: (body) => ({
    method: 'PATCH',
    url: '/api/ticket-app/moderation-ticket/list/bulk-action/',
    body,
  }),
})
