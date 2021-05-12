import { deleteMediaFx } from '@/features/api/media/delete-media'
import { getMediaFx } from '@/features/api/media/get-media'
import { UploadMediaResponse } from '@/features/api/media/types'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { File } from '@/features/api/subject/types'
import { createCommentFx } from '@/features/api/ticket/comment/create-comment'
import { updateTicketBulkFx } from '@/features/api/ticket/moderation/update-ticket-bulk'
import { UpdateTicketBulkType } from '@/features/api/ticket/types'
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
  sample,
} from 'effector-root'
import { canRefreshTableChanged } from '@/pages/applications/incoming/incoming-applications-page.model'
import { updateApplicationsCounters } from '@/pages/common/navigation/navigation.model'
import { isArraysEquel } from '@/features/lib'

const uploadMedia = attach({
  effect: uploadMediaFx,
})

export const deleteMedia = attach({
  effect: deleteMediaFx,
})
const sendComment = attach({
  effect: createCommentFx,
})

const sendToRevision = attach({
  effect: updateTicketBulkFx,
  mapParams: (params: UpdateTicketBulkType) => ({
    ...params,
    accept: null,
    send_to_revision: true,
    set_moderator: null,
    moderator_id: null,
    cancel_outcome: null,
  }),
})

const resetModal = createEvent<void>()
export const loadModal = createEvent<number[]>()
export const $selectedApplications = createStore<number[]>([])
  .on(loadModal, (state, payload) => {
    if (!isArraysEquel(state, payload)) {
      return [...payload]
    }
    return state
  })
  .reset(resetModal)

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

const clearFields = createEvent<void>()
export const commentChanged = createEvent<string>()
export const $comment = restore(commentChanged, '').reset(clearFields)
export const $commentErrorModule = createError()

export const checkIfFormCanBeSend = createEvent<void>()

export const canRefreshAfterSendingToRevision = createEvent<boolean>()
export const $canRefreshAfterSendingToRevision = restore<boolean>(
  canRefreshAfterSendingToRevision,
  false
)

forward({
  from: loadModal,
  to: [
    modalVisibilityChanged.prepend(() => true),
    canRefreshTableChanged.prepend(() => false),
    canRefreshAfterSendingToRevision.prepend(() => false),
  ],
})

export const fileDataChanged = createEvent<Partial<File> | null>()
export const $fileData = restore(fileDataChanged, null).reset(clearFields)

const setSelectedImagesIds = createEvent<number>()
const removeImagesId = createEvent<number>()
const $selectedImagesIds = createStore<number[]>([])
  .on(removeImagesId, (state, payload) => {
    return state.filter((id) => id !== payload)
  })
  .reset(clearFields)

const getImagesPreview = createEvent<number>()
const setImagesPreview = createEvent<UploadMediaResponse>()
const removeImagePreview = createEvent<number>()
export const $imagesPreview = createStore<UploadMediaResponse[]>([])
  .on(setImagesPreview, (state, payload) => {
    return [...state, payload]
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
  to: [setImagesPreview, setSelectedImagesIds.prepend((data) => data.id)],
})

sample({
  clock: setSelectedImagesIds,
  source: $selectedImagesIds,
  fn: (state, payload) => {
    return [...state, payload]
  },
  target: $selectedImagesIds,
})

forward({
  from: deleteMedia,
  to: [removeImagePreview, removeImagesId],
})
forward({
  from: deleteMedia.doneData,
  to: [successToastEvent('Файл был успешно удален!'), fileDataChanged.prepend(() => null)],
})

export const $ticketForm = combine({
  text: $comment,
  media_ids: $selectedImagesIds,
}).on(checkIfFormCanBeSend, (state) => {
  if (!state.text.trim().length) $commentErrorModule.methods.setError(true)
  else sendComment(state)
})

forward({
  from: commentChanged,
  to: $commentErrorModule.methods.resetError,
})

sample({
  clock: sendComment.doneData.map((res) => res.body.id),
  source: $selectedApplications,
  fn: (tickets, comment_id) => ({ tickets, comment_id }),
  target: sendToRevision,
})

forward({
  from: $selectedApplications,
  to: clearFields,
})

forward({
  from: resetModal,
  to: clearFields,
})

forward({
  from: sendToRevision.doneData,
  to: [
    successToastEvent('Задание(я) были успешно отправлены на доработку!'),
    resetModal,
    canRefreshTableChanged.prepend(() => true),
    canRefreshAfterSendingToRevision.prepend(() => true),
    updateApplicationsCounters,
  ],
})

forward({
  from: clearFields,
  to: $commentErrorModule.methods.resetError,
})

forward({
  from: resetModal,
  to: [$commentErrorModule.methods.resetError, modalVisibilityChanged.prepend(() => false)],
})
