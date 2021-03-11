import { deleteTagFx } from '@/features/api/assignment/delete-tag'
import { deleteTagsFx } from '@/features/api/assignment/delete-tags'
import { DEFAULT_ID } from '@/pages/common/constants'
import { createEvent, forward, restore } from 'effector-root'

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
