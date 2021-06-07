import { getThemeFx } from '@/features/api/subject/get-theme'
import { getThemesListFx } from '@/features/api/subject/get-themes-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { attach, createEvent, createStore, forward, restore, sample } from 'effector-root'

export const getThemeData = attach({
  effect: getThemeFx,
})

export const prerequisitesDropdownModel = createFilter()

export const $prerequisites = createStore<DropdownItem[]>([])

export const setSelectedPrerequisites = createEvent<DropdownItem[]>()
export const $selectedPrerequisites = restore<DropdownItem[]>(setSelectedPrerequisites, [])
export const resetSelectedPrerequisites = createEvent()
export const deletePrerequisite = createEvent<string>()

forward({
  from: getThemesListFx.doneData.map((data) =>
    data.body.data
      .filter((item) => item.is_prerequisite)
      .map((elem) => ({ name: `${elem.id}`, title: elem.name, id: elem.id }))
  ),
  to: $prerequisites,
})

sample({
  source: {
    selected: $selectedPrerequisites,
    all: prerequisitesDropdownModel.store.$itemsDropdown,
  },
  clock: prerequisitesDropdownModel.methods.itemChanged,
  fn: (list, element) => {
    const arr = list.selected.slice()
    if (!arr.find(((el: any) => el.name === element) || !arr.length) && element) {
      const elem = list.all.find((full) => full.name === element)
      arr.push(elem!)
    }
    return [...arr]
  },
  target: $selectedPrerequisites,
})
sample({
  source: $selectedPrerequisites,
  clock: resetSelectedPrerequisites,
  fn: () => [],
  target: $selectedPrerequisites,
})

sample({
  source: $selectedPrerequisites,
  clock: deletePrerequisite,
  fn: (list, id: string) => list.filter((el: any) => el.name !== id),
  target: $selectedPrerequisites,
})
