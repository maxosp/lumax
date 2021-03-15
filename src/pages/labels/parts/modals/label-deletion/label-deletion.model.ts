import { deleteLabelFx } from '@/features/api/assignment/labels/delete-label'
import { DEFAULT_ID } from '@/pages/common/constants'
import { createEvent, forward, restore } from 'effector-root'

export const loadModalToDelete = createEvent<number>()

export const setLabelToDelete = createEvent<number>()
export const $labelToDelete = restore<number>(setLabelToDelete, DEFAULT_ID)

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

forward({
  from: loadModalToDelete,
  to: [modalVisibilityChanged.prepend(() => true), setLabelToDelete],
})
forward({
  from: deleteLabelFx.doneData,
  to: modalVisibilityChanged.prepend(() => false),
})
