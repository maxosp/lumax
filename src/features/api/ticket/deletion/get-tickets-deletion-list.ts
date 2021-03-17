import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TableDataResponse } from '@/features/api/types'
import { getTicketsDeletionListQueryParams, Ticket } from '@/features/api/ticket/types'

export const getTicketsDeletionListFx = createApiEffect<
  getTicketsDeletionListQueryParams,
  TableDataResponse<Ticket[]>
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/ticket/deletion-ticket/list/',
    query,
  }),
})
