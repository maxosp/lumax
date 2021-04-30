import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TicketCommentResponseType } from '@/features/api/ticket/types'

export const getCommentFx = createApiEffect<number, TicketCommentResponseType>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/ticket-app/comment/${id}/`,
  }),
})
