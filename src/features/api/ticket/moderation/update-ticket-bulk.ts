import { createApiEffect } from '@/features/api/common/create-api-effect'
import { ModerationTicket, UpdateTicketBulkType } from '@/features/api/ticket/types'

export const updateTicketBulkFx = createApiEffect<UpdateTicketBulkType, ModerationTicket>({
  requestMapper: (body) => ({
    method: 'PATCH',
    url: '/api/ticket-app/moderation-ticket/list/bulk-action/',
    body,
  }),
})
