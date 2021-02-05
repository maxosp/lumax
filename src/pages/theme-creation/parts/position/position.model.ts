import { createEvent, createStore, restore, sample } from 'effector-root'
import { debounce } from 'patronum'
import { POSITION_DROPDOWN_VALUES } from '@/pages/theme-creation/parts/position/constants'
import { PositionDropdownType } from '@/pages/theme-creation/parts/position/types'

export const $positionDropdown = createStore<PositionDropdownType[]>(POSITION_DROPDOWN_VALUES)
export const $_positionDropdown = createStore<PositionDropdownType[]>(POSITION_DROPDOWN_VALUES)

export const positionChanged = createEvent<null | number>()
export const resetPosition = createEvent<void>()
export const $position = restore<null | number>(positionChanged, null).reset(resetPosition)
export const positionSearchStringChanged = createEvent<string>()
export const resetSearchString = createEvent<void>()
export const $positionSearchString = restore<string>(positionSearchStringChanged, '').reset(
  resetSearchString
)

const searchPosition = createEvent<string>()
const restorePositions = createEvent<void>()

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
