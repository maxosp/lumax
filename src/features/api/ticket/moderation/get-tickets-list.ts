import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TableDataResponse } from '@/features/api/types'
import { getTicketsListQueryParams, ModerationTicket } from '@/features/api/ticket/types'

export const getTicketsListFx = createApiEffect<
  getTicketsListQueryParams,
  TableDataResponse<ModerationTicket[]>
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/ticket-app/moderation-ticket/list/',
    query,
  }),
})
