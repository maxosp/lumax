import { attach, createEvent, forward, restore } from 'effector-root'
import {
  getTicketsDeletionListQueryParams,
  UpdateTicketBulkType,
} from '@/features/api/ticket/types'
import { getTicketsDeletionListFx } from '@/features/api/ticket/deletion/get-tickets-deletion-list'
import { updateTicketBulkFx } from '@/features/api/ticket/deletion/update-ticket-bulk'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { modalVisibilityChanged } from '@/pages/applications/modals/cancel/cancel.model'

const getIncomingApplicationsList = attach({
  effect: getTicketsDeletionListFx,
  mapParams: (params: getTicketsDeletionListQueryParams) => ({ ...params, created_by_me: true }),
})

export const cancelApplicationFx = attach({
  effect: updateTicketBulkFx,
  mapParams: (params: UpdateTicketBulkType) => ({
    ...params,
    accept: null,
    decline: null,
    cancel_outcome: true,
  }),
})
export const loadList = createEvent<getTicketsDeletionListQueryParams>()

const canRefreshTableChanged = createEvent<boolean>()
export const $canRefreshTable = restore(canRefreshTableChanged, false)

forward({
  from: loadList,
  to: [getIncomingApplicationsList, canRefreshTableChanged.prepend(() => false)],
})

forward({
  from: cancelApplicationFx.doneData,
  to: [
    successToastEvent('Заявка отменена!'),
    modalVisibilityChanged.prepend(() => false),
    canRefreshTableChanged.prepend(() => true),
  ],
})
