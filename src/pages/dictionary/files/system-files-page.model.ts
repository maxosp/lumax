import {
  attach,
  combine,
  createEffect,
  createEvent,
  createStore,
  forward,
  guard,
  restore,
  sample,
} from 'effector-root'
import { deleteMediaFx } from '@/features/api/media/delete-media'
import { getMediaTreeFx } from '@/features/api/media/get-media-tree'
import { getMediaTreeInfoFx } from '@/features/api/media/get-media-tree-info'
import { getMediaTreeLightFx } from '@/features/api/media/get-media-tree-light'
import { UploadMediaResponse } from '@/features/api/media/types'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { TreeData } from '@/features/api/types'
import { mergeTreeData } from '@/features/lib'
import { addToast, successToastEvent } from '@/features/toasts/toasts.model'
import { confirmDeleteModalVisibilityChanged } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import {
  $dataToUpdateTree,
  resetDataToUpdateTree,
} from '@/pages/common/parts/tree/data-to-update-tree/data-to-update-tree.model'
import { FiltersParams } from '@/pages/common/types'
import { every } from 'patronum'
import { deleteMediaFolderFx } from '@/features/api/media/folder/delete-media-folder'
import { DEFAULT_ID } from '@/pages/common/constants'
import { mediaCopyToFx } from '@/features/api/media/media-copy-to'
import { mediaFolderCopyToFx } from '@/features/api/media/folder/folder-copy-to'

export const getFilesTree = attach({
  effect: getMediaTreeFx,
})

export const getFilteredTree = attach({
  effect: getMediaTreeFx,
})

export const getFilesTreeLight = attach({
  effect: getMediaTreeLightFx,
})

export const getFilesTreeInfo = attach({
  effect: getMediaTreeInfoFx,
})

export const deleteSelectedFolderFx = attach({
  effect: deleteMediaFolderFx,
})

export const deleteSelectedFileFx = attach({
  effect: deleteMediaFx,
})

const uploadMedia = attach({
  effect: uploadMediaFx,
})

export const pasteFileFx = attach({
  effect: mediaCopyToFx,
})

export const pasteFolderFx = attach({
  effect: mediaFolderCopyToFx,
})

export const loadTreeLight = createEvent<void>()
export const loadTree = createEvent<FiltersParams>()
export const loadFilteredTree = createEvent<FiltersParams>()
const rewriteFilesTree = createEvent<TreeData[] | null>()
export const setFilesTree = createEvent<TreeData[] | null>()
export const $filesTree = restore<TreeData[] | null>(rewriteFilesTree, null).on(
  setFilesTree,
  (state, data) => mergeTreeData(state!, data!)
)
export const setFilesTreeTotal = createEvent<number>()
export const $filesTreeTotal = restore<number>(setFilesTreeTotal, 0)

export const uploadFile = createEvent<{ files: FileList; folderID: number }>()
export const setFolderId = createEvent<number>()
export const $folderId = restore(setFolderId, DEFAULT_ID)

forward({
  from: loadTreeLight,
  to: [getFilesTreeLight, getFilesTreeInfo],
})

forward({
  from: loadTree,
  to: [getFilesTree, getFilesTreeInfo.prepend(() => ({}))],
})

forward({
  from: loadFilteredTree,
  to: getFilteredTree,
})

export const $isLoading = combine(
  getFilteredTree.pending,
  getFilesTreeLight.pending,
  (tree, light) => tree || light
)

forward({
  from: getFilesTreeInfo.doneData.map(({ body }) => body.total_amount),
  to: setFilesTreeTotal,
})

forward({
  from: getFilesTreeLight.doneData,
  to: rewriteFilesTree.prepend(({ body }) => body.data),
})

forward({
  from: getFilteredTree.doneData,
  to: [
    rewriteFilesTree.prepend(({ body }) => body.data),
    setFilesTreeTotal.prepend(({ body }) => body.total),
  ],
})

forward({
  from: getFilesTree.doneData,
  to: [setFilesTree.prepend(({ body }) => body.data), resetDataToUpdateTree.prepend(() => ({}))],
})

const $canUpdateTree = every({
  stores: [$dataToUpdateTree],
  predicate: (value) => !!Object.entries(value).length,
})

sample({
  clock: guard({ source: getFilesTreeLight.doneData, filter: $canUpdateTree }),
  source: $dataToUpdateTree,
  fn: (obj) => ({ folder: obj.folder }),
  target: loadTree,
})

forward({
  from: deleteSelectedFolderFx.doneData,
  to: [
    loadTreeLight,
    confirmDeleteModalVisibilityChanged.prepend(() => false),
    successToastEvent('Папка успешно удалена'),
  ],
})

forward({
  from: deleteSelectedFileFx.doneData,
  to: [
    loadTreeLight,
    confirmDeleteModalVisibilityChanged.prepend(() => false),
    successToastEvent('Файл успешно удален'),
  ],
})

export const uploadFileFx = createEffect({
  handler: (data: { files: FileList | null; folderId: number }): Promise<UploadMediaResponse> => {
    return Array.from(data.files || []).map(
      (file) =>
        new Promise<UploadMediaResponse>((resolve) => {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('file_type', 'file')
          formData.append('folder_id', `${data.folderId}`)
          const res = uploadMedia(formData).then((r) => r.body)
          resolve(res)
        })
    )[0]
  },
})

forward({
  from: uploadFile,
  to: [
    uploadFileFx.prepend((data) => ({ files: data.files, folderId: data.folderID })),
    addToast.prepend(() => ({ type: 'loading', message: 'Идет загрузка файла(ов)' })),
  ],
})

forward({
  from: uploadMedia.doneData,
  to: [successToastEvent('Загрузка завершена!'), loadTreeLight],
})

const clearCopyPasteElements = createEvent<void>()
export const setElementToCopy = createEvent<{ id: number; type: string }>()
export const $elementToCopy = restore(setElementToCopy, { id: DEFAULT_ID, type: '' }).reset(
  clearCopyPasteElements
)

export const pasteFile = createEvent<number>()
export const pasteFolder = createEvent<number>()
const $folderToPasteId = createStore(DEFAULT_ID)
  .on(pasteFile, (state, payload) => payload)
  .on(pasteFolder, (state, payload) => payload)
  .reset(clearCopyPasteElements)

const $formToPasteFile = combine({
  folder_id: $folderToPasteId,
  media_id: $elementToCopy.map(({ id }) => id),
})

const $formToPasteFolder = combine({
  folder_to_id: $folderToPasteId,
  folder_obj_id: $elementToCopy.map(({ id }) => id),
})

sample({
  clock: pasteFile,
  source: $formToPasteFile,
  target: pasteFileFx,
})
sample({
  clock: pasteFolder,
  source: $formToPasteFolder,
  target: pasteFolderFx,
})

forward({
  from: pasteFileFx.doneData,
  to: [loadTreeLight, successToastEvent('Файл был успешно скопирован!'), clearCopyPasteElements],
})
forward({
  from: pasteFolderFx.doneData,
  to: [loadTreeLight, successToastEvent('Файл был успешно скопирован!'), clearCopyPasteElements],
})
