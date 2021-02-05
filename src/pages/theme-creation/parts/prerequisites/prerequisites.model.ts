import { createEvent, createStore, restore, sample } from 'effector-root'
import { debounce } from 'patronum'
import { PREREQUISITE_DROPDOWN_VALUES } from '@/pages/theme-creation/parts/prerequisites/constants'

export const deletePrerequisite = createEvent<number>()
export const $prerequisitesList = createStore(PREREQUISITE_DROPDOWN_VALUES)
export const $_prerequisitesList = createStore(PREREQUISITE_DROPDOWN_VALUES)

export const setSelectedPrerequisite = createEvent<{ id: number; title: string }>()
export const $selectedPrerequisites = createStore([] as any)
export const resetSelectedPrerequisites = createEvent<void>()

sample({
  source: $selectedPrerequisites,
  clock: setSelectedPrerequisite,
  fn: (list, element) => {
    const arr = list.slice()
    if (!arr.find((el: any) => el.id === element.id) || !arr.length) arr.push(element)
    return arr
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
  fn: (list, id: number) => list.filter((el: any) => el.id !== id),
  target: $selectedPrerequisites,
})

export const prerequisiteChanged = createEvent<null | number>()
export const $prerequisite = restore<null | number>(prerequisiteChanged, null)
export const prerequisiteSearchStringChanged = createEvent<string>()
export const resetSearchString = createEvent()
export const $prerequisiteSearchString = restore(prerequisiteSearchStringChanged, '').reset(
  resetSearchString
)

const searchPrerequisite = createEvent<string>()
const restorePrerequisite = createEvent()

const debounced = debounce({
  source: $prerequisiteSearchString,
  timeout: 150,
})

debounced.watch((str) => {
  if ($prerequisite && str.length) prerequisiteChanged(null)
  if (str.length) searchPrerequisite(str)
  else restorePrerequisite()
})

sample({
  source: $_prerequisitesList,
  clock: searchPrerequisite,
  fn: (list, str) => list.filter((el) => el.title.toLowerCase().indexOf(str.toLowerCase()) !== -1),
  target: $prerequisitesList,
})
sample({
  source: $_prerequisitesList,
  clock: restorePrerequisite,
  target: $prerequisitesList,
})
