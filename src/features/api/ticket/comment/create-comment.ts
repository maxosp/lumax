import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TicketCommentRequestType, TicketCommentResponseType } from '@/features/api/ticket/types'

export const createCommentFx = createApiEffect<TicketCommentRequestType, TicketCommentResponseType>(
  {
    requestMapper: (body) => ({
      method: 'POST',
      url: '/api/ticket-app/comment/',
      body,
    }),
  }
)
