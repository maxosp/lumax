import { attach, createEvent, forward, restore } from 'effector-root'
import { getTicketsListFx } from '@/features/api/ticket/moderation/get-tickets-list'
import { getTicketsListQueryParams, UpdateTicketBulkType } from '@/features/api/ticket/types'
import { updateTicketBulkFx } from '@/features/api/ticket/moderation/update-ticket-bulk'
import { successToastEvent } from '@/features/toasts/toasts.model'

const getIncomingApplicationsList = attach({
  effect: getTicketsListFx,
  mapParams: (params: getTicketsListQueryParams) => ({ ...params, created_by_me: false }),
})

export const acceptApplicationsFx = attach({
  effect: updateTicketBulkFx,
  mapParams: (params: UpdateTicketBulkType) => ({
    ...params,
    accept: true,
    send_to_revision: null,
    comment_id: null,
    set_moderator: null,
    moderator_id: null,
    cancel_outcome: null,
  }),
})

export const loadList = createEvent<getTicketsListQueryParams>()

export const canRefreshTableChanged = createEvent<boolean>()
export const $canRefreshTable = restore(canRefreshTableChanged, false)

forward({
  from: loadList,
  to: [getIncomingApplicationsList, canRefreshTableChanged.prepend(() => false)],
})

forward({
  from: acceptApplicationsFx.doneData,
  to: [
    successToastEvent('Задание(я) были успешно приняты'),
    canRefreshTableChanged.prepend(() => true),
  ],
})
