import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
import {
  getTicketsDeletionListQueryParams,
  UpdateTicketBulkType,
} from '@/features/api/ticket/types'
import { getTicketsDeletionListFx } from '@/features/api/ticket/deletion/get-tickets-deletion-list'
import { updateTicketBulkFx } from '@/features/api/ticket/deletion/update-ticket-bulk'
import { modalVisibilityChanged } from '@/pages/applications/modals/reject/reject.model'
import { modalVisibilityChanged as rejectedModalVisibilityChanged } from '@/pages/applications/modals/rejected/rejected.model'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { modalVisibilityChanged as deleteModalVisibilityChanged } from '@/pages/applications/modals/delete/delete.model'
import { createPageParamsModel } from '@/pages/common/page-params/create-page-params-model'
import { incomingDeletionFilters } from '@/pages/applications/incoming-deletion/parts/filter/filter.model'

const getIncomingApplicationsList = attach({
  effect: getTicketsDeletionListFx,
  mapParams: (params: getTicketsDeletionListQueryParams) => ({ ...params, created_by_me: false }),
})

export const rejectApplications = attach({
  effect: updateTicketBulkFx,
  mapParams: (params: UpdateTicketBulkType) => ({
    ...params,
    accept: null,
    decline: true,
    cancel_outcome: null,
  }),
})

export const deleteApplication = attach({
  effect: updateTicketBulkFx,
  mapParams: (params: UpdateTicketBulkType) => ({
    ...params,
    accept: true,
    decline: null,
    cancel_outcome: null,
  }),
})

export const incomingDeletionPageParams = createPageParamsModel()

export const $isLoading = combine(getTicketsDeletionListFx.pending, (list) => list)

export const loadList = createEvent<getTicketsDeletionListQueryParams>()

const canRefreshTableChanged = createEvent<boolean>()
export const $canRefreshTable = restore(canRefreshTableChanged, false)

forward({
  from: loadList,
  to: [getIncomingApplicationsList, canRefreshTableChanged.prepend(() => false)],
})

forward({
  from: rejectApplications.doneData,
  to: [
    modalVisibilityChanged.prepend(() => false),
    successToastEvent('Заявка(и) отклонена(ы)'),
    rejectedModalVisibilityChanged.prepend(() => true),
    canRefreshTableChanged.prepend(() => true),
  ],
})

forward({
  from: deleteApplication.doneData,
  to: [
    deleteModalVisibilityChanged.prepend(() => false),
    canRefreshTableChanged.prepend(() => true),
    successToastEvent('Заявка(и) удалена(ы)'),
  ],
})

forward({
  from: incomingDeletionFilters.methods.resetFilters,
  to: loadList.prepend(() => ({})),
})

sample({
  clock: incomingDeletionFilters.methods.applyFilters,
  source: incomingDeletionFilters.store.$filterParams,
  target: loadList,
})
