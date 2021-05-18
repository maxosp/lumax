import { attach, createEvent, sample, forward, restore } from 'effector-root'
import {
  $switchers,
  resetSwitchers,
} from '@/pages/bank/lesson-tasks/list/parts/modals/tasks-update/parts/switchers/swichers.model'
import { areAssignmentsIdsValid } from '@/lib/validators/assignments-list'
import { createError } from '@/lib/effector/error-generator'
import { errorToastEvent, addToast, successToastEvent } from '@/features/toasts/toasts.model'
import { updateLessonAssignmentBulkFx } from '@/features/api/assignment/lesson-assignment/update-lesson-assignment-bulk'
import { condition } from 'patronum'
import { formatFailToGetIdResponseMessage } from '@/pages/bank/common/lib'
import { TaskUpdateForm } from '@/pages/bank/lesson-tasks/list/parts/modals/tasks-update/types'
import { LessonAssignmentsBulkUpdate } from '@/features/api/assignment/types/lesson-assignments-types'
import { entries } from '@/features/lib'
import { UpdateAssignmentsBulkFailResponse } from '@/features/api/assignment/types/types'

const makeMultiChanges = attach({
  effect: updateLessonAssignmentBulkFx,
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
  to: [resetField, resetSwitchers],
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
  source: { $tasksIds, $switchers },
  fn: (form): LessonAssignmentsBulkUpdate => {
    const params: LessonAssignmentsBulkUpdate = {
      assignments: form.$tasksIds.split(',').map((el: string) => +el),
    }

    const checkedSwitcher = entries(form.$switchers).find((switcher) => switcher[1])
    if (checkedSwitcher) [params.status] = checkedSwitcher

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

condition({
  source: makeMultiChanges.failData.map((res): UpdateAssignmentsBulkFailResponse => res.body),
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
