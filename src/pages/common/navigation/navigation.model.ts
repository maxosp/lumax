import { attach, createEvent, restore } from 'effector-root'
import { getApplicationsCountersFx } from '@/features/api/ticket/common/get-counters'
import { forward } from 'effector'

export const changeNavState = createEvent<boolean>()
export const $isOpened = restore(changeNavState, true)

export const changeOpenedItem = createEvent<string | null>()
export const $openedItem = restore(changeOpenedItem, null)

export const updateTotalApplicationsCounter = createEvent<number>()
export const $totalApplicationsCounter = restore(updateTotalApplicationsCounter, 0)

export const updateIncomingApplicationsCounter = createEvent<number>()
export const $incomingApplicationsCounter = restore(updateIncomingApplicationsCounter, 0)

export const updateIncomingDeletionApplicationsCounter = createEvent<number>()
export const $incomingDeletionApplicationsCounter = restore(
  updateIncomingDeletionApplicationsCounter,
  0
)

export const updateApplicationsCounters = createEvent<void>()

const getApplicationsCounters = attach({
  effect: getApplicationsCountersFx,
})

forward({
  from: updateApplicationsCounters,
  to: getApplicationsCounters,
})

forward({
  from: getApplicationsCounters.doneData,
  to: [
    updateTotalApplicationsCounter.prepend(({ body }) => body.total_count),
    updateIncomingApplicationsCounter.prepend(({ body }) => body.moderation),
    updateIncomingDeletionApplicationsCounter.prepend(({ body }) => body.deletion),
  ],
})
