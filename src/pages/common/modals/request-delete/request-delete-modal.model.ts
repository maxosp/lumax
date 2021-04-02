import { createEvent, forward, restore } from 'effector-root'

export const requestDeleteModalVisibilityChanged = createEvent<boolean>()
export const $requestDeleteModalVisibility = restore(requestDeleteModalVisibilityChanged, false)

export const commentChanged = createEvent<string>()
export const $comment = restore(commentChanged, '').reset(requestDeleteModalVisibilityChanged)

export const loadRequestDeleteModal = createEvent<number[]>()
export const $selectedIds = restore(loadRequestDeleteModal, [])

forward({
  from: loadRequestDeleteModal,
  to: requestDeleteModalVisibilityChanged.prepend(() => true),
})
