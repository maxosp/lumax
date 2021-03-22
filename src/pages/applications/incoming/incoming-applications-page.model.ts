import { attach, createEvent, forward } from 'effector-root'
import { getTicketsListFx } from '@/features/api/ticket/moderation/get-tickets-list'
import { getTicketsListQueryParams, UpdateTicketType } from '@/features/api/ticket/types'
import { updateTicketBulkFx } from '@/features/api/ticket/moderation/update-ticket-bulk'
import { successToastEvent } from '@/features/toasts/toasts.model'

const getIncomingApplicationsList = attach({
  effect: getTicketsListFx,
  mapParams: (params: getTicketsListQueryParams) => ({ ...params, created_by_me: false }),
})

export const acceptApplicationsFx = attach({
  effect: updateTicketBulkFx,
  mapParams: (params: UpdateTicketType) => ({
    ...params,
    accept: true,
    send_to_revision: null,
    set_moderator: null,
    cancel_outcome: null,
  }),
})

export const loadList = createEvent<getTicketsListQueryParams>()

forward({
  from: loadList,
  to: getIncomingApplicationsList,
})

forward({
  from: acceptApplicationsFx.doneData,
  to: successToastEvent('Задание(я) были успешно приняты'),
})
