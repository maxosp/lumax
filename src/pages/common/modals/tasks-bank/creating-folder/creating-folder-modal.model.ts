import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
import { condition } from 'patronum'
import { createError } from '@/lib/effector/error-generator'
import { errorToastEvent, successToastEvent } from '@/features/toasts/toasts.model'
import { createFolderFx } from '@/features/api/assignment/folder/create-folder'
import {
  $selectedFolder,
  foldersDropdownModule,
  setSelectedFolder,
} from '@/pages/common/dropdowns/bank/lesson-tasks/position-dropdown/position-dropdown.model'
import { loadTreeLight } from '@/pages/bank/lesson-tasks/list/lesson-page.model'

export const createFolder = attach({
  effect: createFolderFx,
})

export const checkIfFolderCanBeSend = createEvent<void>()
export const clearFields = createEvent<void>()

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

export const folderTitleChanged = createEvent<string>()
export const $folderTitle = restore(folderTitleChanged, '').reset(clearFields)

export const $titleErrorModule = createError()

const $form = combine({
  name: $folderTitle,
  parent_id: $selectedFolder.map((data) => (data && data.id ? +data.id : null)),
})

sample({
  source: $form,
  clock: checkIfFolderCanBeSend,
  fn: (obj) => {
    if (obj.name.trim().length) {
      createFolder(obj)
    } else {
      if (!obj.name.trim().length) $titleErrorModule.methods.setError(true)
      errorToastEvent('Необходимо заполнить все обязательные поля')
    }
  },
})

forward({
  from: folderTitleChanged,
  to: $titleErrorModule.methods.resetError,
})

condition({
  source: modalVisibilityChanged,
  if: (payload: boolean) => !payload,
  then: clearFields,
})

forward({
  from: clearFields,
  to: [
    foldersDropdownModule.methods.resetDropdown,
    $titleErrorModule.methods.resetError,
    setSelectedFolder.prepend(() => null),
  ],
})

forward({
  from: createFolderFx.doneData,
  to: [
    loadTreeLight.prepend(() => ({})),
    modalVisibilityChanged.prepend(() => false),
    successToastEvent('Тема была успешно создана!'),
  ],
})
