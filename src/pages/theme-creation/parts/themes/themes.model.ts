import { createEvent, createStore, restore, sample } from 'effector-root'
import { debounce } from 'patronum'
import { THEMES_DROPDOWN_VALUE } from '@/pages/theme-creation/parts/themes/constants'

export const deleteTheme = createEvent<number>()
export const $themesList = createStore(THEMES_DROPDOWN_VALUE)
export const $_themesList = createStore(THEMES_DROPDOWN_VALUE)

export const setSelectedTheme = createEvent<{ id: number; title: string }>()
export const $selectedThemes = createStore([] as any)

sample({
  source: $selectedThemes,
  clock: setSelectedTheme,
  fn: (list, element) => {
    const arr = list.slice()
    if (!arr.find((el: any) => el.id === element.id) || !arr.length) arr.push(element)
    return arr
  },
  target: $selectedThemes,
})

sample({
  source: $selectedThemes,
  clock: deleteTheme,
  fn: (list, id: number) => list.filter((el: any) => el.id !== id),
  target: $selectedThemes,
})

export const resetTheme = createEvent<void>()
export const themeChanged = createEvent<null | number>()
export const $theme = restore<null | number>(themeChanged, null).reset(resetTheme)
export const themeSearchStringChanged = createEvent<string>()
export const resetSearchString = createEvent()
export const $themeSearchString = restore(themeSearchStringChanged, '').reset(resetSearchString)

const searchTheme = createEvent<string>()
const restoreTheme = createEvent()

const debounced = debounce({
  source: $themeSearchString,
  timeout: 150,
})

debounced.watch((str) => {
  if ($theme && str.length) themeChanged(null)
  if (str.length) searchTheme(str)
  else restoreTheme()
})

sample({
  source: $_themesList,
  clock: searchTheme,
  fn: (list, str) => list.filter((el) => el.title.toLowerCase().indexOf(str.toLowerCase()) !== -1),
  target: $themesList,
})
sample({
  source: $_themesList,
  clock: restoreTheme,
  target: $themesList,
})
