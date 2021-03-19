import { getTicketFx } from '@/features/api/ticket/deletion/get-ticket'
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

forward({
  from: loadCommentModal,
  to: [modalVisibilityChanged.prepend(() => true), loadApplicationFx],
})

spread({
  source: loadApplicationFx.doneData.map((res) => res.body),
  targets: {
    comment: setComment,
  },
})
