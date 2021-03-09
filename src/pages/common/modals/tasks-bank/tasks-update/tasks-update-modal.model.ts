import { createEvent, forward, restore } from 'effector-root'
import { resetSwitchers } from '@/pages/common/modals/tasks-bank/tasks-update/parts/switchers/swichers.model'
import {
  moderatorDropdownModule,
  setSelectedModerator,
} from '@/pages/common/modals/tasks-bank/tasks-update/parts/moderator-dropdown/moderator-dropdown.model'

export const tasksUpdateModalVisibilityChanged = createEvent<boolean>()
export const $tasksUpdateModalVisibility = restore(tasksUpdateModalVisibilityChanged, false)

export const submitForm = createEvent<void>()
export const cancelForm = createEvent<void>()

const resetField = createEvent<void>()
export const tasksIdsChanged = createEvent<string>()
export const $tasksIds = restore<string>(tasksIdsChanged, '').reset(resetField)

forward({
  from: [submitForm, cancelForm],
  to: [
    resetField,
    resetSwitchers,
    moderatorDropdownModule.methods.resetItem,
    moderatorDropdownModule.methods.resetSearchString,
    setSelectedModerator.prepend(() => null),
  ],
})

forward({
  from: cancelForm,
  to: tasksUpdateModalVisibilityChanged.prepend(() => false),
})
