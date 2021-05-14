import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
import { condition } from 'patronum'
import { createError } from '@/lib/effector/error-generator'
import { errorToastEvent, successToastEvent } from '@/features/toasts/toasts.model'
import {
  $folders,
  foldersDropdownModule,
  setSelectedFolder,
} from '@/pages/common/dropdowns/system-files/position-dropdown/position-dropdown.model'
import { DEFAULT_ID } from '@/pages/common/constants'
import { updateMediaFx } from '@/features/api/media/update-media'
import { getMediaFx } from '@/features/api/media/get-media'
import { loadTreeLight } from '@/pages/dictionary/files/system-files-page.model'
import { findItem } from '@/pages/common/filter-dropdown/lib'
import { DropdownItem } from '@/pages/common/types'
import { getMediaFolderFx } from '@/features/api/media/folder/get-media-folder'
import { updateMediaFolderFx } from '@/features/api/media/folder/update-media-folder'

export const updateFolder = attach({
  effect: updateMediaFolderFx,
})

export const updateFileFx = attach({
  effect: updateMediaFx,
})

export const getFolder = attach({
  effect: getMediaFolderFx,
})

export const getFileFx = attach({
  effect: getMediaFx,
})

export const setElementType = createEvent<string>()
export const $elementType = restore(setElementType, '')

export const loadFolder = createEvent<number>()
export const loadFile = createEvent<number>()

const setParentId = createEvent<number | null>()
const $parentId = restore(setParentId, null)

const setFolderId = createEvent<number>()
const $folderId = restore(setFolderId, DEFAULT_ID)

const setFileId = createEvent<number>()
const $fileId = restore(setFileId, DEFAULT_ID)

const $elementId = combine($folderId, $fileId, $elementType, (folderId, fileId, type) =>
  type === 'folder' ? folderId : fileId
)

export const checkIfFolderCanBeSend = createEvent<void>()
export const clearFields = createEvent<void>()

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

export const titleChanged = createEvent<string>()
export const $title = restore(titleChanged, '').reset(clearFields)

export const $titleErrorModule = createError()

const $form = combine({
  name: $title,
  id: $elementId,
  parent_id: $parentId,
})

forward({
  from: setSelectedFolder,
  to: setParentId.prepend((data: DropdownItem | null) => data!.id || null),
})
sample({
  source: { form: $form, type: $elementType },
  clock: checkIfFolderCanBeSend,
  fn: (obj) => {
    const { form } = obj
    const { type } = obj
    if (form.name.trim().length) {
      type === 'folder' ? updateFolder(form) : updateFileFx({ id: form.id, file_name: form.name })
    } else {
      if (!form.name.trim().length) $titleErrorModule.methods.setError(true)
      errorToastEvent('Необходимо заполнить все обязательные поля')
    }
  },
})

forward({
  from: titleChanged,
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
    titleChanged.prepend(() => ''),
    foldersDropdownModule.methods.resetDropdown,
    $titleErrorModule.methods.resetError,
    setParentId.prepend(() => null),
  ],
})

forward({
  from: loadFolder,
  to: [getFolder, modalVisibilityChanged.prepend(() => true)],
})
forward({
  from: loadFile,
  to: [getFileFx, modalVisibilityChanged.prepend(() => true)],
})

forward({
  from: getFileFx.doneData.map(({ body }) => body),
  to: [
    titleChanged.prepend(({ file_name }) => file_name),
    setFolderId.prepend(({ folder }) => folder!.id!),
    setFileId.prepend(({ id }) => id),
  ],
})
forward({
  from: getFolder.doneData.map(({ body }) => body),
  to: [titleChanged.prepend(({ name }) => name!), setFolderId.prepend(({ id }) => id!)],
})

sample({
  source: $folders,
  clock: getFolder.doneData.map(({ body }) => body),
  fn: (folders, data) => {
    const elem = findItem(`${data.id}`, folders)
    return elem!
  },
  target: [
    setParentId.prepend((data: DropdownItem | null) => data!.parent_id || null),
    foldersDropdownModule.methods.itemChanged.prepend(
      (data: DropdownItem | null) => `${data!.parent_id}`
    ),
  ],
})

sample({
  source: $folders,
  clock: getFileFx.doneData.map(({ body }) => body),
  fn: (folders, data) => {
    const elem = findItem(`${data.folder?.id}`, folders)
    return elem!
  },
  target: [
    setParentId.prepend((data: DropdownItem | null) => data!.parent_id || null),
    foldersDropdownModule.methods.itemChanged.prepend((data: DropdownItem | null) => data!.name),
  ],
})

forward({
  from: updateFolder.doneData,
  to: [
    loadTreeLight.prepend(() => ({})),
    modalVisibilityChanged.prepend(() => false),
    successToastEvent('Папка была успешно обновлена!'),
  ],
})

forward({
  from: updateFileFx.doneData,
  to: [
    loadTreeLight.prepend(() => ({})),
    modalVisibilityChanged.prepend(() => false),
    successToastEvent('Файл был успешно обновлен!'),
  ],
})
