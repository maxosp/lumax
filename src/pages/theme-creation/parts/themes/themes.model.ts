import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { findItem } from '@/pages/common/filter-dropdown/lib'
import { DropdownItem } from '@/pages/common/types'
import { createEvent, createStore, forward, sample } from 'effector'
import { subjectDropdownModule } from '@/pages/theme-creation/parts/subjects/subjects.model'

export const themeDropdownModule = createFilter()

export const $themes = createStore<DropdownItem[]>([])

export const $selectedThemes = createStore<DropdownItem[]>([])
export const resetSelectedThemes = createEvent()
export const deleteTheme = createEvent<string>()

sample({
  source: {
    selected: $selectedThemes,
    all: themeDropdownModule.store.$itemsDropdown,
  },
  clock: themeDropdownModule.methods.itemChanged,
  fn: (list, element) => {
    const arr = list.selected.slice()
    if (arr.find((el) => el.id === +element!) === undefined || arr.length === 0) {
      const elem = findItem(element!, list.all)
      arr.push(elem!)
    }
    return [...arr]
  },
  target: $selectedThemes,
})
themeDropdownModule.methods.itemChanged.watch((data) => console.log(data))

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
