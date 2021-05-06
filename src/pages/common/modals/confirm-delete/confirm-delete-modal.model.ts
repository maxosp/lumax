import { createEvent, forward, restore } from 'effector-root'

type DeleteType = 'task' | 'theme' | 'subject' | 'resource' | 'label' | 'tag' | 'test' | 'folder'

export const confirmDeleteModalVisibilityChanged = createEvent<boolean>()
export const $confirmDeleteModalVisibility = restore(confirmDeleteModalVisibilityChanged, false)

export const setDeleteType = createEvent<DeleteType>()
export const $deleteType = restore(setDeleteType, 'task')

export const loadConfirmDeleteModal = createEvent<number[]>()
export const $selectedIds = restore(loadConfirmDeleteModal, [])

forward({
  from: loadConfirmDeleteModal,
  to: confirmDeleteModalVisibilityChanged.prepend(() => true),
})
