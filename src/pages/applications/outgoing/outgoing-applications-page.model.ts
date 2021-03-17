import { attach, createEvent, forward } from 'effector-root'
import { getTicketsListFx } from '@/features/api/ticket/moderation/get-tickets-list'
import { getTicketsListQueryParams } from '@/features/api/ticket/types'

const getOutgoingApplicationsList = attach({
  effect: getTicketsListFx,
  mapParams: (params: getTicketsListQueryParams) => ({ ...params, created_by_me: true }),
})

export const loadList = createEvent<getTicketsListQueryParams>()

forward({
  from: loadList,
  to: getOutgoingApplicationsList,
})
