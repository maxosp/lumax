import { forward, createEvent, attach, restore } from 'effector-root'
import { getThemesListFx } from '@/features/api/subject/get-themes-list'
import { Theme } from '@/features/api/subject/types'

export const loadThemes = createEvent<void>()
export const setThemes = createEvent<Theme[]>()
export const $themes = restore(setThemes, [])

export const toggleTreeView = createEvent<boolean>()
export const $treeView = restore(toggleTreeView, false)

const getThemes = attach({
  effect: getThemesListFx,
})

forward({
  from: loadThemes,
  to: getThemes.prepend(() => ({
    page: 1,
    per_page: 25,
    sort: '',
  })),
})

forward({
  from: getThemes.doneData,
  to: setThemes.prepend((res) => res.body.data),
})

export const $isLoading = getThemes.pending
