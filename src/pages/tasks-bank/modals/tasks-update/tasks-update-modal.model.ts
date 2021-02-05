import { createEvent, forward, restore } from 'effector-root'
import { resetSwitchers } from '@/pages/tasks-bank/modals/tasks-update/parts/switchers/swichers.model'
import { resetModerator } from '@/pages/tasks-bank/modals/tasks-update/parts/moderator-dropdown/moderator-dropdown.model'
import { resetDifficulty } from '@/pages/tasks-bank/modals/tasks-update/parts/difficulty-dropdown/difficulty.model'

export const tasksUpdateModalVisibilityChanged = createEvent<boolean>()
export const $tasksUpdateModalVisibility = restore(tasksUpdateModalVisibilityChanged, false)

export const submitForm = createEvent<void>()
export const cancelForm = createEvent<void>()

const resetField = createEvent<void>()
export const tasksIdsChanged = createEvent<string>()
export const $tasksIds = restore<string>(tasksIdsChanged, '').reset(resetField)

forward({
  from: [submitForm, cancelForm],
  to: [resetField, resetSwitchers, resetModerator, resetDifficulty],
})

forward({
  from: cancelForm,
  to: tasksUpdateModalVisibilityChanged.prepend(() => false),
})
