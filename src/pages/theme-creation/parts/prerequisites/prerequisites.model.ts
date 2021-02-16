import { getThemeFx } from '@/features/api/subject/get-theme'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { attach, createEvent, createStore, forward, sample } from 'effector'

export const getThemeData = attach({
  effect: getThemeFx,
  mapParams: (params: number) => params,
})

export const prerequisiteDropdownModule = createFilter()

export const $prerequisites = createStore<DropdownItem[]>([])

export const $selectedPrerequisites = createStore<DropdownItem[]>([])
export const resetSelectedPrerequisites = createEvent()
export const deletePrerequisite = createEvent<string>()

forward({
  from: getThemeData.doneData.map((data) =>
    data.body.prerequisites
      .filter((item) => item.is_prerequisite)
      .map((elem) => ({ name: `${elem.id}`, title: elem.name }))
  ),
  to: $prerequisites,
})

sample({
  source: {
    selected: $selectedPrerequisites,
    all: prerequisiteDropdownModule.store.$itemsDropdown,
  },
  clock: prerequisiteDropdownModule.methods.itemChanged,
  fn: (list, element) => {
    const arr = list.selected.slice()
    if (!arr.find((el: any) => el.name === element) || !arr.length) {
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
