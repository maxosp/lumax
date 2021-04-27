import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
import { condition } from 'patronum'
import { createError } from '@/lib/effector/error-generator'
import { errorToastEvent, successToastEvent } from '@/features/toasts/toasts.model'
import { updateFolderFx } from '@/features/api/assignment/folder/update-folder'
import { getFolderFx } from '@/features/api/assignment/folder/get-folder'
import {
  $folders,
  $selectedFolder,
  foldersDropdownModule,
  setSelectedFolder,
} from '@/pages/common/dropdowns/bank/lesson-tasks/position-dropdown/position-dropdown.model'
import { loadTreeLight } from '@/pages/bank/lesson-tasks/list/lesson-page.model'
import { DEFAULT_ID } from '@/pages/common/constants'

export const updateFolder = attach({
  effect: updateFolderFx,
})

export const getFolder = attach({
  effect: getFolderFx,
})

export const loadFolder = createEvent<number>()

const setFolderId = createEvent<number>()
const $folderId = restore(setFolderId, DEFAULT_ID)

export const checkIfFolderCanBeSend = createEvent<void>()
export const clearFields = createEvent<void>()

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

export const folderTitleChanged = createEvent<string>()
export const $folderTitle = restore(folderTitleChanged, '').reset(clearFields)

export const $titleErrorModule = createError()

const $form = combine({
  name: $folderTitle,
  id: $folderId,
  parent_id: $selectedFolder.map((data) => (data && data.id ? +data.id : null)),
})

sample({
  source: $form,
  clock: checkIfFolderCanBeSend,
  fn: (obj) => {
    if (obj.name.trim().length) {
      updateFolder({ id: obj.id, body: obj })
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
  from: loadFolder,
  to: getFolder,
})

forward({
  from: getFolder.doneData.map(({ body }) => body),
  to: [folderTitleChanged.prepend(({ name }) => name!), setFolderId.prepend(({ id }) => id!)],
})

const searchParentFolder = function (id: number, folders: any) {
  // Using any type, because position-dropdown -> $folders has another type from TreeData and FolderType.
  return folders.find((folder: any) => {
    if (folder.id === id) {
      return folder
    }
    if (folder.leaves) {
      searchParentFolder(id, folder.leaves)
    }
    return null
  })
}

sample({
  source: $folders,
  clock: getFolder.doneData.map(({ body }) => body),
  fn: (folders, data) => {
    let res = null
    folders.forEach((folder) => {
      if (folder.id === data.parent_id) {
        res = folder
        return res
      }
      if (folder.leaves?.length) {
        const fold = searchParentFolder(data.parent_id, folder.leaves)
        if (fold) {
          res = fold
          return res
        }
      }
    })
    return res
  },
  target: setSelectedFolder,
})

sample({
  source: $selectedFolder,
  clock: setSelectedFolder,
  fn: (data): string | null => `${data?.id}`,
  target: foldersDropdownModule.methods.itemChanged,
})

forward({
  from: updateFolder.doneData,
  to: [
    loadTreeLight.prepend(() => ({})),
    modalVisibilityChanged.prepend(() => false),
    successToastEvent('Папка была успешно обновлена!'),
  ],
})
