import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
import {
  $switchers,
  resetSwitchers,
} from '@/pages/bank/test-tasks/list/parts/modals/tasks-update/parts/switchers/swichers.model'
import {
  $selectedModerator,
  moderatorDropdownModule,
  setSelectedModerator,
} from '@/pages/common/dropdowns/users/moderator-dropdown/moderator-dropdown.model'
import { $selectedDifficulty } from '@/pages/bank/test-tasks/list/parts/modals/tasks-update/parts/difficulty-dropdown/difficulty.model'
import { condition } from 'patronum'
import { SwitchersOptionsType } from '@/pages/bank/test-tasks/list/parts/modals/tasks-update/parts/switchers/types'
import { areAssignmentsIdsValid } from '@/lib/validators/assignments-list'
import { createError } from '@/lib/effector/error-generator'
import { addToast, successToastEvent } from '@/features/toasts/toasts.model'
import { updateTestAssignmentBulkFx } from '@/features/api/assignment/test-assignment/update-test-assignment-bulk'
import { DEFAULT_ID } from '@/pages/common/constants'

const makeMultiChanges = attach({
  effect: updateTestAssignmentBulkFx,
})
export const loadModalForMultiChanges = createEvent<number[]>()

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

const setSelectedType = createEvent<string>()
export const $selectedType = restore(setSelectedType, '')

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

condition({
  source: $switchers,
  if: (payload: SwitchersOptionsType) => payload.moderation,
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
  to: modalVisibilityChanged.prepend(() => false),
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
  difficulty: $selectedDifficulty.map((data) => {
    if ((data && +data.name && +data.name !== DEFAULT_ID) || (data && +data.name === 0))
      return +data.name
    return undefined
  }),
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
    successToastEvent('Данные были успешно обновлены!'),
    modalVisibilityChanged.prepend(() => false),
    clearFields,
    canRefreshAfterMultiChangesChanged.prepend(() => true),
  ],
})

condition({
  source: modalVisibilityChanged,
  if: (payload: boolean) => !payload,
  then: clearFields,
})

forward({
  from: makeMultiChanges.failData.map((res) => res.body),
  to: addToast.prepend((data: any) => ({ type: 'error', message: data.detail })),
})
