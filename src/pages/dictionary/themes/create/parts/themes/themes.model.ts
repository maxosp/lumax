import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { findItem } from '@/pages/common/filter-dropdown/lib'
import { DropdownItem } from '@/pages/common/types'
import { createEvent, createStore, forward, restore, sample } from 'effector-root'
import { subjectDropdownModule } from '@/pages/dictionary/themes/create/parts/subjects/subjects.model'

export const themeDropdownModule = createFilter()

export const $themes = createStore<DropdownItem[]>([])

export const setSelectedThemes = createEvent<DropdownItem[]>()
export const $selectedThemes = restore<DropdownItem[]>(setSelectedThemes, [])
export const resetSelectedThemes = createEvent()
export const deleteTheme = createEvent<string>()

sample({
  source: {
    selected: $selectedThemes,
    all: themeDropdownModule.store.$itemsDropdown,
  },
  clock: themeDropdownModule.methods.itemChanged,
  fn: (list, elementId) => {
    if (!list.all.length) return []
    const arr = list.selected.slice()
    if (arr.find((el) => el.id === +elementId!) === undefined) {
      const elem = findItem(elementId!, list.all)
      if (elem) arr.push(elem!)
    }
    return [...arr]
  },
  target: $selectedThemes,
})

sample({
  source: $selectedThemes,
  clock: resetSelectedThemes,
  fn: () => [],
  target: $selectedThemes,
})
forward({
  from: deleteTheme,
  to: themeDropdownModule.methods.resetItem,
})

sample({
  source: $selectedThemes,
  clock: deleteTheme,
  fn: (list, id: string) => list.filter((el: any) => el.name !== id),
  target: $selectedThemes,
})
forward({
  from: subjectDropdownModule.methods.itemChanged,
  to: [
    themeDropdownModule.methods.resetItem,
    themeDropdownModule.methods.resetSearchString,
    resetSelectedThemes,
  ],
})
