import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
import { condition } from 'patronum'
import { createError } from '@/lib/effector/error-generator'
import { DEFAULT_ID } from '@/pages/common/constants'
import { errorToastEvent, successToastEvent } from '@/features/toasts/toasts.model'
import { CreateFolderType } from '@/features/api/assignment/types'
import { createFolderFx } from '@/features/api/assignment/folder/create-folder'
import {
  $selectedFolder,
  foldersDropdownModule,
  setSelectedFolder,
} from '@/pages/common/dropdowns/bank/position-dropdown/position-dropdown.model'
import { getLessonAssignmentTreeFx } from '@/features/api/assignment/lesson-assignment/get-lesson-assignment-tree'
import { getLessonAssignmentTreeLightFx } from '@/features/api/assignment/lesson-assignment/get-lesson-assignment-tree-light'

export const createFolder = attach({
  effect: createFolderFx,
  mapParams: (params: CreateFolderType) => params,
})

export const checkIfFolderCanBeSend = createEvent<void>()
export const clearFields = createEvent<void>()

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

export const folderTitleChanged = createEvent<string>()
export const $folderTitle = restore(folderTitleChanged, '').reset(clearFields)

export const $positionErrorModule = createError()
export const $titleErrorModule = createError()

const $form = combine({
  name: $folderTitle,
  parent_id: $selectedFolder.map((data) => (data && data.id ? +data.id : DEFAULT_ID)),
})

sample({
  source: $form,
  clock: checkIfFolderCanBeSend,
  fn: (obj) => {
    if (obj.name.trim().length && obj.parent_id !== DEFAULT_ID) {
      createFolder(obj)
    } else {
      if (!obj.name.trim().length) $titleErrorModule.methods.setError(true)
      if (obj.parent_id === DEFAULT_ID) $positionErrorModule.methods.setError(true)
      errorToastEvent('Необходимо заполнить все обязательные поля')
    }
  },
})

forward({
  from: folderTitleChanged,
  to: $titleErrorModule.methods.resetError,
})

forward({
  from: foldersDropdownModule.methods.itemChanged,
  to: $positionErrorModule.methods.resetError,
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
    $positionErrorModule.methods.resetError,
    setSelectedFolder.prepend(() => null),
  ],
})

forward({
  from: createFolderFx.doneData,
  to: [
    getLessonAssignmentTreeFx.prepend(() => ({})),
    getLessonAssignmentTreeLightFx.prepend(() => ({})),
    modalVisibilityChanged.prepend(() => false),
    successToastEvent('Тема была успешно создана!'),
  ],
})
