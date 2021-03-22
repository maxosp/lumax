import { attach, createEvent, forward } from 'effector-root'
import { getTicketsDeletionListQueryParams } from '@/features/api/ticket/types'
import { getTicketsDeletionListFx } from '@/features/api/ticket/deletion/get-tickets-deletion-list'

const getIncomingApplicationsList = attach({
  effect: getTicketsDeletionListFx,
  mapParams: (params: getTicketsDeletionListQueryParams) => ({ ...params, created_by_me: true }),
})

export const loadList = createEvent<getTicketsDeletionListQueryParams>()

forward({
  from: loadList,
  to: getIncomingApplicationsList,
})
