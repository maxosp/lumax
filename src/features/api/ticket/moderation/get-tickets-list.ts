import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TableDataResponse } from '@/features/api/types'
import { getTicketsListQueryParams, Ticket } from '@/features/api/ticket/types'

export const getTicketsListFx = createApiEffect<
  getTicketsListQueryParams,
  TableDataResponse<Ticket[]>
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/ticket/moderation-ticket/list/',
    query,
  }),
})
