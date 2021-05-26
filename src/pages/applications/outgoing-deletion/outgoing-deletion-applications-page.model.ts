import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
import {
  getTicketsDeletionListQueryParams,
  UpdateTicketBulkType,
} from '@/features/api/ticket/types'
import { getTicketsDeletionListFx } from '@/features/api/ticket/deletion/get-tickets-deletion-list'
import { updateTicketBulkFx } from '@/features/api/ticket/deletion/update-ticket-bulk'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { modalVisibilityChanged } from '@/pages/applications/modals/cancel/cancel.model'
import { createPageParamsModel } from '@/pages/common/page-params/create-page-params-model'
import { outgoingDeletionFilters } from '@/pages/applications/outgoing-deletion/parts/filter/filter.model'

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

export const outgoingDeletionPageParams = createPageParamsModel()

export const $isLoading = combine(getTicketsDeletionListFx.pending, (list) => list)

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

forward({
  from: outgoingDeletionFilters.methods.resetFilters,
  to: loadList.prepend(() => ({})),
})

sample({
  clock: outgoingDeletionFilters.methods.applyFilters,
  source: outgoingDeletionFilters.store.$filterParams,
  target: loadList,
})
