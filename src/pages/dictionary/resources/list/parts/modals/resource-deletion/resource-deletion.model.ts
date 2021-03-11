import { deleteResourceFx } from '@/features/api/media/delete-resource'
import { DEFAULT_ID } from '@/pages/common/constants'
import { createEvent, forward, restore } from 'effector-root'

export const loadModalToDelete = createEvent<number>()

export const setResourceToDelete = createEvent<number>()
export const $resourceToDelete = restore<number>(setResourceToDelete, DEFAULT_ID)

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

forward({
  from: loadModalToDelete,
  to: [modalVisibilityChanged.prepend(() => true), setResourceToDelete],
})

forward({
  from: deleteResourceFx.doneData,
  to: modalVisibilityChanged.prepend(() => false),
})
