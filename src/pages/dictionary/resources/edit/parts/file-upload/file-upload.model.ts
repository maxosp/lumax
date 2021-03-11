import { attach, createEffect, createEvent, forward, restore } from 'effector-root'
import { deleteMediaFx } from '@/features/api/media/delete-media'
import { UploadMediaResponse } from '@/features/api/media/types'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { File } from '@/features/api/subject/types'
import { addToast } from '@/features/toasts/toasts.model'

const uploadMedia = attach({
  effect: uploadMediaFx,
})

export const deleteMedia = attach({
  effect: deleteMediaFx,
})

export const uploadFile = createEvent<FileList>()

export const fileDataChanged = createEvent<Partial<File> | null>()
const resetFileId = createEvent<void>()
export const $fileData = restore(fileDataChanged, null).reset(resetFileId)

export const uploadFileFx = createEffect({
  handler: (files: FileList | null): Promise<UploadMediaResponse> => {
    return Array.from(files || []).map(
      (file) =>
        new Promise<UploadMediaResponse>((resolve) => {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('file_type', 'file')
          const res = uploadMedia(formData).then((r) => r.body)
          resolve(res)
        })
    )[0]
  },
})

forward({
  from: uploadFile,
  to: [
    uploadFileFx,
    addToast.prepend(() => ({ type: 'loading', message: 'Идет загрузка файла(ов)' })),
  ],
})

forward({
  from: uploadMedia.doneData,
  to: [
    fileDataChanged.prepend((file) => ({
      id: file.body.id,
      file_name: file.body.file_name,
      file_type: file.body.file_type,
    })),
    addToast.prepend(() => ({ type: 'success', message: 'Загрузка завершена!' })),
  ],
})

forward({
  from: deleteMedia.doneData,
  to: [
    addToast.prepend(() => ({ type: 'success', message: 'Файл был успешно удален!' })),
    fileDataChanged.prepend(() => null),
  ],
})
