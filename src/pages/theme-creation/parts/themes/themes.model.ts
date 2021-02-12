import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { createEvent, createStore, sample } from 'effector'

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
    if (!arr.find((el: any) => el.name === element) || !arr.length) {
      const elem = list.all.find((full) => full.name === element)
      arr.push(elem!)
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

sample({
  source: $selectedThemes,
  clock: deleteTheme,
  fn: (list, id: string) => list.filter((el: any) => el.name !== id),
  target: $selectedThemes,
})
