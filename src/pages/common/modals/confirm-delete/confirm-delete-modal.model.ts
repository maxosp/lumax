import { createEvent, forward, restore } from 'effector-root'

export const confirmDeleteModalVisibilityChanged = createEvent<boolean>()
export const $confirmDeleteModalVisibility = restore(confirmDeleteModalVisibilityChanged, false)

export const loadConfirmDeleteModal = createEvent<number[]>()
export const $selectedIds = restore(loadConfirmDeleteModal, [])

forward({
  from: loadConfirmDeleteModal,
  to: confirmDeleteModalVisibilityChanged.prepend(() => true),
})
