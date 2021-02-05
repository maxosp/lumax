import { createEvent, createStore, restore, sample } from 'effector-root'
import { debounce } from 'patronum'
import { POSITION_DROPDOWN_VALUES } from '@/pages/theme-creation/parts/position/constants'

export const $positionDropdown = createStore(POSITION_DROPDOWN_VALUES)
export const $_positionDropdown = createStore(POSITION_DROPDOWN_VALUES)

export const positionChanged = createEvent<null | number>()
export const $position = restore<null | number>(positionChanged, null)
export const positionSearchStringChanged = createEvent<string>()
export const resetSearchString = createEvent()
export const $positionSearchString = restore(positionSearchStringChanged, '').reset(
  resetSearchString
)

const searchPosition = createEvent<string>()
const restorePositions = createEvent()

const debounced = debounce({
  source: $positionSearchString,
  timeout: 150,
})

debounced.watch((str) => {
  if ($position && str.length) positionChanged(null)
  if (str.length) searchPosition(str)
  else restorePositions()
})

sample({
  source: $_positionDropdown,
  clock: searchPosition,
  fn: (list, str) => list.filter((el) => el.title.toLowerCase().indexOf(str.toLowerCase()) !== -1),
  target: $positionDropdown,
})
sample({
  source: $_positionDropdown,
  clock: restorePositions,
  target: $positionDropdown,
})
