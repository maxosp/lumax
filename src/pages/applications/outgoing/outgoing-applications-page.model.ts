import { attach, createEvent, forward, restore } from 'effector-root'
import { getTicketsListFx } from '@/features/api/ticket/moderation/get-tickets-list'
import { getTicketsListQueryParams, UpdateTicketBulkType } from '@/features/api/ticket/types'
import { updateTicketBulkFx } from '@/features/api/ticket/moderation/update-ticket-bulk'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { modalVisibilityChanged } from '../modals/cancel/cancel.model'

export const cancelApplicationsFx = attach({
  effect: updateTicketBulkFx,
  mapParams: (params: UpdateTicketBulkType) => ({
    ...params,
    accept: null,
    send_to_revision: null,
    set_moderator: null,
    cancel_outcome: true,
  }),
})

export const canUpdateTableChanged = createEvent<boolean>()
export const $canUpdateTable = restore(canUpdateTableChanged, false)

const getOutgoingApplicationsList = attach({
  effect: getTicketsListFx,
  mapParams: (params: getTicketsListQueryParams) => ({ ...params, created_by_me: true }),
})

export const loadList = createEvent<getTicketsListQueryParams>()

forward({
  from: loadList,
  to: [getOutgoingApplicationsList, canUpdateTableChanged.prepend(() => false)],
})

forward({
  from: cancelApplicationsFx.doneData,
  to: [
    successToastEvent('Заявки(а) были успешно отменены'),
    modalVisibilityChanged.prepend(() => false),
    canUpdateTableChanged.prepend(() => true),
  ],
})
