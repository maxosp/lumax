import { createEvent, createStore, restore, sample } from 'effector-root'
import { debounce } from 'patronum'

export const resetClass = createEvent<void>()
export const classChanged = createEvent<null | number>()
export const $class = restore<null | number>(classChanged, null).reset(resetClass)
export const classSearchStringChanged = createEvent<string>()
export const resetSearchString = createEvent<void>()
export const $classSearchString = restore<string>(classSearchStringChanged, '').reset(
  resetSearchString
)

export const $_classDropdown = createStore<number[]>(
  Array.from({ length: 11 }, (el, index) => index + 1)
)
export const $classDropdown = createStore<number[]>(
  Array.from({ length: 11 }, (el, index) => index + 1)
)

const searchClass = createEvent<string>()
const restoreClassDropdown = createEvent<void>()

const debounced = debounce({
  source: $classSearchString,
  timeout: 150,
})

debounced.watch((str) => {
  if ($class && str.length) classChanged(null)
  if (str.length) searchClass(str)
  else restoreClassDropdown()
})

sample({
  source: $_classDropdown,
  clock: searchClass,
  fn: (list, str) => list.filter((el) => `${el}`.includes(str)),
  target: $classDropdown,
})

sample({
  source: $_classDropdown,
  clock: restoreClassDropdown,
  target: $classDropdown,
})
