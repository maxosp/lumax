import { createEvent, forward, restore } from 'effector-root'
import { DEFAULT_ID } from '@/pages/common/constants'
import { deleteTagFx, deleteTagsFx } from '@/features/api/assignment/olympiad-tags/delete-tag'

export const loadModalToDelete = createEvent<number[]>()

export const setTagsToDelete = createEvent<number[]>()
export const $tagsToDelete = restore<number[]>(setTagsToDelete, [DEFAULT_ID])

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

forward({
  from: loadModalToDelete,
  to: [modalVisibilityChanged.prepend(() => true), setTagsToDelete],
})

forward({
  from: [deleteTagFx.doneData, deleteTagsFx.doneData],
  to: modalVisibilityChanged.prepend(() => false),
})
