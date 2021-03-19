import { createApiEffect } from '@/features/api/common/create-api-effect'
import { Ticket } from '@/features/api/ticket/types'

export const getTicketFx = createApiEffect<number, Ticket>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/ticket/deletion-ticket/${id}/`,
  }),
})
