import { addToast, errorToastEvent, successToastEvent } from '@/features/toasts/toasts.model'
import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
import { condition } from 'patronum'
import { DEFAULT_ID } from '@/pages/common/constants'
import {
  $selectedModerator,
  moderatorDropdownModule,
} from '@/pages/common/dropdowns/users/moderator-dropdown/moderator-dropdown.model'
import { createError } from '@/lib/effector/error-generator'
import { UpdateAssignmentsBulkParams } from '@/features/api/assignment/types'
import { loadTreeLight } from '@/pages/bank/test-tasks/list//tasks-page.model'
import { updateTestAssignmentBulkFx } from '@/features/api/assignment/test-assignment/update-test-assignment-bulk'
import { updateOlympiadAssignmentBulkFx } from '@/features/api/assignment/olympiad-assignment/update-olympiad-bulk'
import { updateLessonAssignmentBulkFx } from '@/features/api/assignment/lesson-assignment/update-lesson-assignment-bulk'
import { TaskType } from '@/pages/bank/common/modals/moderator-select/constants'

export const sendTestAssignmentsToModeration = attach({
  effect: updateTestAssignmentBulkFx,
  mapParams: (params: UpdateAssignmentsBulkParams) => ({ ...params, status: 'moderation' }),
})

export const sendOlympiadAssignmentForModaration = attach({
  effect: updateOlympiadAssignmentBulkFx,
  mapParams: (params: UpdateAssignmentsBulkParams) => ({
    ...params,
    status: 'moderation',
  }),
})

export const sendLessonAssignmentForModaration = attach({
  effect: updateLessonAssignmentBulkFx,
  mapParams: (params: UpdateAssignmentsBulkParams) => ({
    ...params,
    status: 'moderation',
  }),
})

export const loadModalToSendForCheck = createEvent<number[]>()

export const canRefreshAfterSendingForModerationChanged = createEvent<boolean>()
export const $canRefreshAfterSendingForModeration = restore<boolean>(
  canRefreshAfterSendingForModerationChanged,
  false
)

export const checkIfTaskCanBeSend = createEvent<void>()
export const clearFields = createEvent<void>()

const $selectedAssignment = restore<number[]>(loadModalToSendForCheck, [DEFAULT_ID]).reset(
  clearFields
)

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

export const $moderatorErrorModule = createError()

export const setTaskType = createEvent<TaskType>()
const $taskType = restore(setTaskType, '').reset(clearFields)

forward({
  from: loadModalToSendForCheck,
  to: [
    modalVisibilityChanged.prepend(() => true),
    canRefreshAfterSendingForModerationChanged.prepend(() => false),
  ],
})

const $form = combine({
  assignments: $selectedAssignment,
  moderator_id: $selectedModerator.map((data) => (data && +data.name) || DEFAULT_ID),
})

sample({
  source: { form: $form, type: $taskType },
  clock: checkIfTaskCanBeSend,
  fn: (obj) => {
    if (obj.form.moderator_id !== DEFAULT_ID && obj.form.assignments) {
      switch (obj.type) {
        case 'test':
          sendTestAssignmentsToModeration(obj.form)
          break
        case 'olympiad':
          sendOlympiadAssignmentForModaration(obj.form)
          break
        case 'lesson':
          sendLessonAssignmentForModaration(obj.form)
          break
        default:
          break
      }
    } else {
      if (obj.form.moderator_id === DEFAULT_ID) $moderatorErrorModule.methods.setError(true)
      errorToastEvent('Необходимо заполнить все обязательные поля')
    }
  },
})

condition({
  source: modalVisibilityChanged,
  if: (payload: boolean) => !payload,
  then: clearFields,
})

forward({
  from: clearFields,
  to: [$moderatorErrorModule.methods.resetError, moderatorDropdownModule.methods.resetDropdown],
})

forward({
  from: sendTestAssignmentsToModeration.doneData,
  to: [
    loadTreeLight.prepend(() => ({})),
    modalVisibilityChanged.prepend(() => false),
    successToastEvent('Задание было успешно отправлено на проверку'),
    canRefreshAfterSendingForModerationChanged.prepend(() => true),
  ],
})
forward({
  from: [sendOlympiadAssignmentForModaration.doneData, sendLessonAssignmentForModaration.doneData],
  to: [
    modalVisibilityChanged.prepend(() => false),
    successToastEvent('Задание было успешно отправлено на проверку'),
    canRefreshAfterSendingForModerationChanged.prepend(() => true),
  ],
})

forward({
  from: moderatorDropdownModule.methods.itemChanged,
  to: $moderatorErrorModule.methods.resetError,
})

forward({
  from: [
    sendTestAssignmentsToModeration.failData.map((res) => res.body),
    sendOlympiadAssignmentForModaration.failData.map((res) => res.body),
    sendLessonAssignmentForModaration.failData.map((res) => res.body),
  ],
  to: [
    addToast.prepend((data: any) => ({ type: 'error', message: data.detail })),
    modalVisibilityChanged.prepend(() => false),
  ],
})
