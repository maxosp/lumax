import { deleteThemeFx } from '@/features/api/subject/delete-theme'
import { deleteThemesFx } from '@/features/api/subject/delete-themes'
import { DEFAULT_ID } from '@/pages/common/constants'
import { createEvent, forward, restore } from 'effector-root'

export const loadModalToDelete = createEvent<number[]>()

export const setThemeToDelete = createEvent<number[]>()
export const $themeToDelete = restore<number[]>(setThemeToDelete, [DEFAULT_ID])

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

forward({
  from: loadModalToDelete,
  to: [modalVisibilityChanged.prepend(() => true), setThemeToDelete],
})

forward({
  from: [deleteThemeFx.doneData, deleteThemesFx.doneData],
  to: modalVisibilityChanged.prepend(() => false),
})
