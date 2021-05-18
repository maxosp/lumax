import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TableDataResponse } from '@/features/api/types'
import { getTicketsDeletionListQueryParams, ModerationTicket } from '@/features/api/ticket/types'

export const getTicketsDeletionListFx = createApiEffect<
  getTicketsDeletionListQueryParams,
  TableDataResponse<ModerationTicket[]>
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/ticket-app/deletion-ticket/list/',
    query,
  }),
})
