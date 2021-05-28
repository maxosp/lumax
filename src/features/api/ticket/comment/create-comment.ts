import { createApiEffect } from '@/features/api/common/create-api-effect'
import {
  TicketCommentFailType,
  TicketCommentRequestType,
  TicketCommentResponseType,
} from '@/features/api/ticket/types'

export const createCommentFx = createApiEffect<
  TicketCommentRequestType,
  TicketCommentResponseType,
  TicketCommentFailType
>({
  requestMapper: (body) => ({
    method: 'POST',
    url: '/api/ticket-app/comment/',
    body,
  }),
})
