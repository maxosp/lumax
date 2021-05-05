import { UploadMediaResponse } from '@/features/api/media/types'
import { getTicketFx } from '@/features/api/ticket/moderation/get-ticket'
import { DEFAULT_ID } from '@/pages/common/constants'
import { attach, createEvent, forward, restore } from 'effector-root'
import { spread } from 'patronum'

const loadApplicationFx = attach({
  effect: getTicketFx,
})

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

export const loadCommentModal = createEvent<number>()

export const $selectedId = restore<number>(loadCommentModal, DEFAULT_ID)

const setComment = createEvent<string>()
export const $comment = restore(setComment, '')

const setImages = createEvent<UploadMediaResponse[] | null>()
export const $images = restore<UploadMediaResponse[] | null>(setImages, null)

forward({
  from: loadCommentModal,
  to: [modalVisibilityChanged.prepend(() => true), loadApplicationFx.prepend((data) => data)],
})

spread({
  source: loadApplicationFx.doneData.map((res) => res.body.comment),
  targets: {
    text: setComment,
    media: setImages,
  },
})
