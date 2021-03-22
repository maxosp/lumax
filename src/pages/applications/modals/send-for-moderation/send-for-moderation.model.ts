import { deleteMediaFx } from '@/features/api/media/delete-media'
import { getMediaFx } from '@/features/api/media/get-media'
import { UploadMediaResponse } from '@/features/api/media/types'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { File } from '@/features/api/subject/types'
import { addToast, successToastEvent } from '@/features/toasts/toasts.model'
import { createError } from '@/lib/effector/error-generator'
import {
  attach,
  combine,
  createEffect,
  createEvent,
  createStore,
  forward,
  restore,
} from 'effector-root'

const uploadMedia = attach({
  effect: uploadMediaFx,
})

export const deleteMedia = attach({
  effect: deleteMediaFx,
})

const clearFields = createEvent<void>()
export const loadModal = createEvent<number[]>()
export const $selectedApplications = restore<number[]>(loadModal, []).reset(clearFields)

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

export const commentChanged = createEvent<string>()
export const $comment = restore(commentChanged, '').reset(clearFields)
export const $commentErrorModule = createError()

export const uploadFile = createEvent<FileList>()
export const checkIfFormCanBeSend = createEvent<void>()

forward({
  from: loadModal,
  to: modalVisibilityChanged.prepend(() => true),
})

export const fileDataChanged = createEvent<Partial<File> | null>()
export const $fileData = restore(fileDataChanged, null).reset(clearFields)

const getImagesPreview = createEvent<number>()
const setImagesPreview = createEvent<UploadMediaResponse>()
const removeImagePreview = createEvent<number>()
export const $imagesPreview = createStore<UploadMediaResponse[]>([])
  .on(setImagesPreview, (state, payload) => {
    state.push(payload)
    return state
  })
  .on(removeImagePreview, (state, payload) => state.filter((el) => el.id !== payload))
  .reset(clearFields)

export const uploadFileFx = createEffect({
  handler: (files: FileList | null): Promise<UploadMediaResponse> => {
    return Array.from(files || []).map(
      (file) =>
        new Promise<UploadMediaResponse>((resolve) => {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('file_type', 'image')
          const res = uploadMedia(formData).then((r) => r.body)
          resolve(res)
        })
    )[0]
  },
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
    getImagesPreview.prepend((file) => file.body.id),
  ],
})

forward({
  from: getImagesPreview,
  to: getMediaFx,
})

forward({
  from: getMediaFx.doneData.map((res) => res.body),
  to: setImagesPreview,
})

forward({
  from: deleteMedia,
  to: removeImagePreview,
})
forward({
  from: deleteMedia.doneData,
  to: [successToastEvent('Файл был успешно удален!'), fileDataChanged.prepend(() => null)],
})

const fakeSubmitForm = createEvent<void>()

export const $form = combine({
  tickets: $selectedApplications.map((data) => data),
  comment: $comment.map((data) => data),
}).on(checkIfFormCanBeSend, (state) => {
  if (!state.comment.trim().length) $commentErrorModule.methods.setError(true)
  else fakeSubmitForm()
})

forward({
  from: commentChanged,
  to: $commentErrorModule.methods.resetError,
})

forward({
  from: fakeSubmitForm,
  to: [successToastEvent('Задание(я) были успешно отправлены на доработку!'), clearFields],
})

forward({
  from: clearFields,
  to: [$commentErrorModule.methods.resetError, modalVisibilityChanged.prepend(() => false)],
})
