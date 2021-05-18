import { attach, createEvent, forward, restore, sample } from 'effector-root'
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
import { addToast, errorToastEvent, successToastEvent } from '@/features/toasts/toasts.model'
import { updateTestAssignmentBulkFx } from '@/features/api/assignment/test-assignment/update-test-assignment-bulk'
import { DEFAULT_ID } from '@/pages/common/constants'
import { formatFailToGetIdResponseMessage } from '@/pages/bank/common/lib'
import { TaskUpdateForm } from '@/pages/bank/lesson-tasks/list/parts/modals/tasks-update/types'
import { TestAssignmentsBulkUpdate } from '@/features/api/assignment/types/test-assignments-types'
import { entries } from '@/features/lib'
import { UpdateAssignmentsBulkFailResponse } from '@/features/api/assignment/types/types'

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

const validateData = createEvent<TaskUpdateForm>()
const validationIsPassed = createEvent<boolean>()

const sentForm = createEvent<void>()
const setValidationError = createEvent<void>()

export const $tasksIdsErrorModule = createError()

const canSetModeratorChanged = createEvent<boolean>()
export const $canSetModerator = restore(canSetModeratorChanged, false)

forward({
  from: loadModalForMultiChanges,
  to: [
    tasksIdsChanged.prepend((data) => data.join(',')),
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
    moderatorDropdownModule.methods.resetDropdown,
    setSelectedModerator.prepend(() => null),
  ],
})

forward({
  from: cancelForm,
  to: modalVisibilityChanged.prepend(() => false),
})

sample({
  clock: submitForm,
  source: { $tasksIds },
  target: validateData,
})

sample({
  clock: validateData,
  fn: (form: TaskUpdateForm) => {
    return areAssignmentsIdsValid(form.$tasksIds)
  },
  target: validationIsPassed,
})

condition({
  source: validationIsPassed,
  if: (passed: boolean) => passed,
  then: sentForm,
  else: setValidationError,
})

sample({
  clock: sentForm,
  source: { $tasksIds, $switchers, $selectedDifficulty, $selectedModerator },
  fn: (form): TestAssignmentsBulkUpdate => {
    const params: TestAssignmentsBulkUpdate = {
      assignments: form.$tasksIds.split(',').map((el: string) => +el),
    }

    const checkedSwitcher = entries(form.$switchers).find((switcher) => switcher[1])
    if (checkedSwitcher) [params.status] = checkedSwitcher

    if (
      form.$selectedDifficulty &&
      !isNaN(+form.$selectedDifficulty.name) &&
      +form.$selectedDifficulty.name !== DEFAULT_ID
    )
      params.difficulty = +form.$selectedDifficulty

    if (form.$selectedModerator && +form.$selectedModerator.name)
      params.moderator_id = +form.$selectedModerator.name

    return params
  },
  target: makeMultiChanges,
})

forward({
  from: setValidationError,
  to: [
    $tasksIdsErrorModule.methods.setError.prepend(() => true),
    errorToastEvent('ID заданий указаны в неправильном формате'),
  ],
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

condition({
  source: makeMultiChanges.failData.map((res) => res.body),
  if: (data: UpdateAssignmentsBulkFailResponse) => !!data.detail,
  then: addToast.prepend((data: UpdateAssignmentsBulkFailResponse) => ({
    type: 'error',
    message: data.detail!,
  })),
  else: addToast.prepend((data: UpdateAssignmentsBulkFailResponse) => ({
    type: 'error',
    message: formatFailToGetIdResponseMessage(data.assignments![0]),
  })),
})
