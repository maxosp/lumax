import { createEvent, createStore, forward, attach, restore } from 'effector-root'
import { getThemesListFx } from '@/features/api/subject/get-themes-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { Theme } from '@/features/api/subject/types'

export const getThemes = attach({
  effect: getThemesListFx,
})

export const themesDropdownModule = createFilter()

export const loadThemes = createEvent<void>()
export const $themes = createStore<DropdownItem[]>([])
export const $themesData = createStore<Theme[]>([])

export const setSelectedTheme = createEvent<DropdownItem | null>()
export const $selectedTheme = restore(setSelectedTheme, null)

forward({
  from: loadThemes,
  to: getThemes.prepend(() => ({})),
})

forward({
  from: getThemes.doneData.map((res) =>
    res.body.data.map((theme) => ({ name: `${theme.id}`, title: theme.name }))
  ),
  to: $themes,
})

forward({
  from: getThemes.doneData.map((res) => res.body.data),
  to: $themesData,
})
