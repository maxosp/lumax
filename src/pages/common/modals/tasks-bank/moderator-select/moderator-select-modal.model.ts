import { addToast } from '@/features/toasts/toasts.model'
import { attach, createEvent, forward, restore, split } from 'effector-root'
import { createTagFx } from '@/features/api/assignment/create-tag'
import { CreateTagType } from '@/features/api/assignment/types'
import { getTagsListFx } from '@/features/api/assignment/get-tags-list'
import { condition } from 'patronum'

export const createTag = attach({
  effect: createTagFx,
  mapParams: (params: CreateTagType) => params,
})

export const loadModalToSendForCheck = createEvent<number>()

export const canRefreshAfterCreationChange = createEvent<boolean>()
export const $canRefreshTableAfterCreation = restore<boolean>(canRefreshAfterCreationChange, false)

export const checkIfThemeCanBeSend = createEvent<void>()
export const clearFields = createEvent<void>()

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

forward({
  from: loadModalToSendForCheck,
  to: [modalVisibilityChanged.prepend(() => true)],
})
// sample({
//   source: $form,
//   clock: checkIfThemeCanBeSend,
//   fn: (obj) => {
//     if (obj.name.trim().length && obj.study_year_id !== DEFAULT_ID && obj.subject_id !== DEFAULT_ID)
//       createTag(obj)
//     else {
//       if (!obj.name.trim().length) titleErrorChanged(true)
//       if (obj.study_year_id === DEFAULT_ID) classErrorChanged(true)
//       if (obj.subject_id === DEFAULT_ID) subjectErrorChanged(true)
//       addToast({ type: 'error', message: 'Необходимо заполнить все обязательные поля' })
//     }
//   },
// })

condition({
  source: modalVisibilityChanged,
  if: (payload: boolean) => !payload,
  then: clearFields,
})

const { noInternetConnection } = split(createTagFx.failData, {
  noInternetConnection: ({ status }) => status === undefined,
})

forward({
  from: noInternetConnection,
  to: addToast.prepend(() => ({ type: 'no-internet', message: 'Отсутствует подключение' })),
})

forward({
  from: createTagFx.doneData,
  to: [
    getTagsListFx.prepend(() => ({})),
    modalVisibilityChanged.prepend(() => false),
    addToast.prepend(() => ({ type: 'success', message: 'Тег был успешно создан!' })),
    canRefreshAfterCreationChange.prepend(() => true),
  ],
})
