import { attach, createEvent, forward, restore, sample } from 'effector-root'
import {
  $switchers,
  resetSwitchers,
} from '@/pages/bank/olympiad-tasks/list/parts/modals/tasks-update/parts/switchers/swichers.model'
import { areAssignmentsIdsValid } from '@/lib/validators/assignments-list'
import { createError } from '@/lib/effector/error-generator'
import { errorToastEvent, successToastEvent } from '@/features/toasts/toasts.model'
import {
  $selectedScore,
  scoreDropdownModule,
} from '@/pages/bank/olympiad-tasks/list/parts/modals/tasks-update/parts/score-dropdown/score-dropdown.model'
import { updateOlympiadAssignmentBulkFx } from '@/features/api/assignment/olympiad-assignment/update-olympiad-bulk'
import { DEFAULT_ID } from '@/pages/common/constants'
import { condition } from 'patronum'
import { TaskUpdateForm } from '@/pages/bank/lesson-tasks/list/parts/modals/tasks-update/types'
import { UpdateAssignmentsBulkParams } from '@/features/api/assignment/types'

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

forward({
  from: clearFields,
  to: [resetField, resetSwitchers, scoreDropdownModule.methods.resetDropdown],
})

forward({
  from: cancelForm,
  to: [modalVisibilityChanged.prepend(() => false), clearFields],
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
  source: { $tasksIds, $switchers, $selectedScore },
  fn: (form): UpdateAssignmentsBulkParams => {
    const params: UpdateAssignmentsBulkParams = {
      assignments: form.$tasksIds.split(',').map((el: string) => +el),
    }
    const checkedSwitcher = Object.entries(form.$switchers).find((switcher) => switcher[1])
    if (checkedSwitcher) [params.status] = checkedSwitcher

    if (
      form.$selectedScore &&
      !isNaN(+form.$selectedScore.name) &&
      +form.$selectedScore.name !== DEFAULT_ID
    )
      params.score = +form.$selectedScore

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
