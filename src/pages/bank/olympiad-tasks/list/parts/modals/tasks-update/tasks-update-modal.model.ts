import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
import {
  $switchers,
  resetSwitchers,
} from '@/pages/bank/olympiad-tasks/list/parts/modals/tasks-update/parts/switchers/swichers.model'
import { areAssignmentsIdsValid } from '@/lib/validators/assignments-list'
import { createError } from '@/lib/effector/error-generator'
import { successToastEvent } from '@/features/toasts/toasts.model'
import {
  $selectedScore,
  scoreDropdownModule,
} from '@/pages/bank/olympiad-tasks/list/parts/modals/tasks-update/parts/score-dropdown/score-dropdown.model'
import { updateOlympiadAssignmentBulkFx } from '@/features/api/assignment/olympiad-assignment/update-olympiad-bulk'
import { DEFAULT_ID } from '@/pages/common/constants'
import { condition } from 'patronum'

const makeMultiChanges = attach({
  effect: updateOlympiadAssignmentBulkFx,
})
export const loadModalForMultiChanges = createEvent<number[]>()

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

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
    modalVisibilityChanged.prepend(() => true),
    canRefreshAfterMultiChangesChanged.prepend(() => false),
  ],
})

forward({
  from: clearFields,
  to: [resetField, resetSwitchers, scoreDropdownModule.methods.resetDropdown],
})

forward({
  from: cancelForm,
  to: [modalVisibilityChanged.prepend(() => false), clearFields],
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
  score: $selectedScore.map((data) => {
    if ((data && +data.name && +data.name !== DEFAULT_ID) || (data && +data.name === 0))
      return +data.name
    return undefined
  }),
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

condition({
  source: modalVisibilityChanged,
  if: (payload: boolean) => !payload,
  then: clearFields,
})

forward({
  from: makeMultiChanges.doneData,
  to: [
    successToastEvent('Данные были успешно обновлены!'),
    modalVisibilityChanged.prepend(() => false),
    clearFields,
    canRefreshAfterMultiChangesChanged.prepend(() => true),
  ],
})
