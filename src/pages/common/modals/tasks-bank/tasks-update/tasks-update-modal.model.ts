import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
import {
  $switchers,
  resetSwitchers,
} from '@/pages/common/modals/tasks-bank/tasks-update/parts/switchers/swichers.model'
import {
  $selectedModerator,
  moderatorDropdownModule,
  setSelectedModerator,
} from '@/pages/common/modals/tasks-bank/tasks-update/parts/moderator-dropdown/moderator-dropdown.model'
import { $selectedDifficulty } from '@/pages/common/modals/tasks-bank/tasks-update/parts/difficulty-dropdown/difficulty.model'
import { condition } from 'patronum'
import { SwitchersOptionsType } from '@/pages/common/modals/tasks-bank/tasks-update/parts/switchers/types'
import { areAssignmentsIdsValid } from '@/lib/validators/assignments-list'
import { createError } from '@/lib/effector/error-generator'
import { updateAssignmentsBulkFx } from '@/features/api/assignment/update-assignments-bulk'
import { addToast } from '@/features/toasts/toasts.model'

const makeMultiChanges = attach({
  effect: updateAssignmentsBulkFx,
})
export const loadModalForMultiChanges = createEvent<number[]>()

export const tasksUpdateModalVisibilityChanged = createEvent<boolean>()
export const $tasksUpdateModalVisibility = restore(tasksUpdateModalVisibilityChanged, false)

export const canRefreshAfterMultiChangesChanged = createEvent<boolean>()
export const $canRefreshAfterMultiChanges = restore<boolean>(
  canRefreshAfterMultiChangesChanged,
  false
)

export const submitForm = createEvent<void>()
export const cancelForm = createEvent<void>()

const clearFields = createEvent<void>()

const resetField = createEvent<void>()
export const tasksIdsChanged = createEvent<string>()
export const $tasksIds = restore<string>(tasksIdsChanged, '').reset(resetField)

export const $tasksIdsErrorModule = createError()

const canSetModeratorChanged = createEvent<boolean>()
export const $canSetModerator = restore(canSetModeratorChanged, false)

forward({
  from: loadModalForMultiChanges,
  to: [
    tasksIdsChanged.prepend((data) => data.join(', ')),
    tasksUpdateModalVisibilityChanged.prepend(() => true),
    canRefreshAfterMultiChangesChanged.prepend(() => false),
  ],
})

condition({
  source: $switchers,
  if: (payload: SwitchersOptionsType) => payload.revision,
  then: canSetModeratorChanged.prepend(() => true),
  else: canSetModeratorChanged.prepend(() => false),
})

forward({
  from: clearFields,
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

const $form = combine({
  assignments: $tasksIds.map((data) => {
    const res = data.split(', ').map((el: string) => +el)
    return res
  }),
  status: $switchers.map((data) => {
    const res = Object.entries(data).find((el) => el[1])
    return res && res[0]
  }),
  difficulty: $selectedDifficulty.map((data) => (data && +data.name) || undefined),
  moderator_id: $selectedModerator.map((data) => (data && +data.name) || undefined),
})

sample({
  clock: submitForm,
  source: $form,
  fn: (obj) => {
    if (!areAssignmentsIdsValid(obj.assignments.join(',')) || !obj.assignments.length)
      $tasksIdsErrorModule.methods.setError(true)
    else makeMultiChanges(obj)
  },
})

forward({
  from: tasksIdsChanged,
  to: $tasksIdsErrorModule.methods.resetError,
})

forward({
  from: makeMultiChanges.doneData,
  to: [
    addToast.prepend(() => ({ type: 'success', message: 'Данные были успешно обновлены!' })),
    tasksUpdateModalVisibilityChanged.prepend(() => false),
    clearFields,
    canRefreshAfterMultiChangesChanged.prepend(() => true),
  ],
})
