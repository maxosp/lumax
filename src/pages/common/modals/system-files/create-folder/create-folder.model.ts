import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
import { condition } from 'patronum'
import { createError } from '@/lib/effector/error-generator'
import { errorToastEvent, successToastEvent } from '@/features/toasts/toasts.model'
import {
  $folders,
  $selectedFolder,
  foldersDropdownModule,
  setSelectedFolder,
} from '@/pages/common/dropdowns/system-files/position-dropdown/position-dropdown.model'
import { DropdownItem } from '@/pages/common/types'
import { getMediaFolderFx } from '@/features/api/media/folder/get-media-folder'
import { createMediaFolderFx } from '@/features/api/media/folder/create-media-folder'
import { loadTreeLight } from '@/pages/dictionary/files/system-files-page.model'
import { findItem } from '@/pages/common/filter-dropdown/lib'

export const createFolder = attach({
  effect: createMediaFolderFx,
})

export const getFolder = attach({
  effect: getMediaFolderFx,
})

export const loadFolder = createEvent<number>()

export const checkIfFolderCanBeSend = createEvent<void>()
export const clearFields = createEvent<void>()

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

export const folderTitleChanged = createEvent<string>()
export const $folderTitle = restore(folderTitleChanged, '').reset(clearFields)

export const $titleErrorModule = createError()

const $form = combine({
  name: $folderTitle,
  parent_id: $selectedFolder.map((data) => (data && data.name ? +data.name : null)),
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
  from: loadFolder,
  to: [getFolder, modalVisibilityChanged.prepend(() => true)],
})

sample({
  source: $folders,
  clock: getFolder.doneData.map(({ body }) => body),
  fn: (folders, data) => {
    const elem = findItem(`${data.id}`, folders)
    return elem!
  },
  target: [
    setSelectedFolder.prepend((data: DropdownItem | null) => ({
      name: `${data!.id}`,
      title: data!.name,
    })),
    foldersDropdownModule.methods.itemChanged.prepend((data: DropdownItem | null) => data!.name),
  ],
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
  from: createMediaFolderFx.doneData,
  to: [
    loadTreeLight.prepend(() => ({})),
    modalVisibilityChanged.prepend(() => false),
    successToastEvent('Папка была успешно создана!'),
  ],
})
