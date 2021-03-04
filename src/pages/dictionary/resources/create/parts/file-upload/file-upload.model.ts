import { deleteMediaFx } from '@/features/api/media/delete-media'
import { UploadMediaResponse } from '@/features/api/media/types'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { addToast } from '@/features/toasts/toasts.model'
import { attach, createEffect, createEvent, forward, merge, restore, split } from 'effector-root'
import { UploadedFilyType } from './types'

const uploadMedia = attach({
  effect: uploadMediaFx,
})

export const deleteMedia = attach({
  effect: deleteMediaFx,
  mapParams: (params: number) => params,
})

export const uploadFile = createEvent<FileList>()

export const fileDataChanged = createEvent<UploadedFilyType | null>()
const resetFileId = createEvent<void>()
export const $fileData = restore(fileDataChanged, null).reset(resetFileId)

export const uploadFileFx = createEffect({
  handler: (files: FileList | null): Promise<UploadMediaResponse> => {
    return Array.from(files || []).map(
      (file) =>
        new Promise<UploadMediaResponse>((resolve) => {
          console.log(file)
          const formData = new FormData()
          formData.append('file', file)
          formData.append('file_type', 'file')
          const res = uploadMedia(formData).then((r) => r.body)
          resolve(res)
        })
    )[0]
  },
})

const { noInternet } = split(merge([uploadMediaFx.failData, deleteMediaFx.failData]), {
  noInternet: ({ status }) => status === undefined,
})

forward({
  from: noInternet,
  to: addToast.prepend(() => ({ type: 'no-internet', message: 'Отсутствует подключение' })),
})

forward({
  from: uploadFile,
  to: [
    uploadFileFx,
    addToast.prepend(() => ({ type: 'loading', message: 'Идет загрузка файла(ов)' })),
  ],
})

forward({
  from: uploadMediaFx.doneData,
  to: [
    fileDataChanged.prepend((file) => ({
      id: file.body.id,
      name: file.body.file_name,
      type: file.body.file_type,
    })),
    addToast.prepend(() => ({ type: 'success', message: 'Загрузка завершена' })),
  ],
})

forward({
  from: deleteMedia.doneData,
  to: addToast.prepend(() => ({ type: 'success', message: 'Файл был успешно удален!' })),
})
