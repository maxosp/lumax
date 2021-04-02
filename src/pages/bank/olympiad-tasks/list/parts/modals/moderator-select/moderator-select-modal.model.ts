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
import { updateOlympiadAssignmentBulkFx } from '@/features/api/assignment/olympiad-assignment/update-olympiad-bulk'

export const sendForModaration = attach({
  effect: updateOlympiadAssignmentBulkFx,
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
  source: $form,
  clock: checkIfTaskCanBeSend,
  fn: (obj) => {
    if (obj.moderator_id !== DEFAULT_ID && obj.assignments) sendForModaration(obj)
    else {
      if (obj.moderator_id === DEFAULT_ID) $moderatorErrorModule.methods.setError(true)
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
  to: [
    $moderatorErrorModule.methods.resetError,
    moderatorDropdownModule.methods.resetItem,
    moderatorDropdownModule.methods.resetSearchString,
  ],
})

forward({
  from: sendForModaration.doneData,
  to: [
    modalVisibilityChanged.prepend(() => false),
    successToastEvent('Задание было успешно отправлено на проверку'),
    canRefreshAfterSendingForModerationChanged.prepend(() => true),
  ],
})
forward({
  from: sendForModaration.failData.map((res) => res.body),
  to: [
    addToast.prepend((data: any) => ({ type: 'error', message: data.detail })),
    modalVisibilityChanged.prepend(() => false),
  ],
})

forward({
  from: moderatorDropdownModule.methods.itemChanged,
  to: $moderatorErrorModule.methods.resetError,
})
