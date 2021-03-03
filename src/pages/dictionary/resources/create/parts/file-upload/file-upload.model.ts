import { UploadMediaResponse } from '@/features/api/media/types'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { addToast } from '@/features/toasts/toasts.model'
import { attach, createEffect, createEvent, forward, restore } from 'effector-root'

const uploadMedia = attach({
  effect: uploadMediaFx,
})

export const uploadFile = createEvent<FileList>()

export const fileIdChanged = createEvent<number>()
const resetFileId = createEvent<void>()
export const $fileId = restore(fileIdChanged, -1).reset(resetFileId)

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
    fileIdChanged.prepend((file) => file.body.id),
    addToast.prepend(() => ({ type: 'success', message: 'Загрузка завершена' })),
  ],
})
