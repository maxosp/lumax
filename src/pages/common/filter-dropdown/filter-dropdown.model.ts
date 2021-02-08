import { createEvent, createStore, forward, restore, sample } from 'effector-root'
import { debounce } from 'patronum'
import { DropdownItem } from '../types'

export const setItems = createEvent<DropdownItem[]>()

export const resetItem = createEvent<void>()
export const itemChanged = createEvent<null | string>()
export const $item = restore<null | string>(itemChanged, null).reset(resetItem)

export const searchStringChanged = createEvent<string>()
export const resetSearchString = createEvent<void>()
export const $searchString = restore<string>(searchStringChanged, '').reset(resetSearchString)

export const $itemsDropdown = createStore<DropdownItem[]>([])
export const $_itemsDropdown = createStore<DropdownItem[]>([])

const searchItem = createEvent<string>()
const restoreItems = createEvent<void>()

forward({
  from: setItems,
  to: [$itemsDropdown, $_itemsDropdown],
})

const debounced = debounce({
  source: $searchString,
  timeout: 150,
})

debounced.watch((str) => {
  if ($item && str.length) itemChanged(null)
  if (str.length) searchItem(str)
  else restoreItems()
})

sample({
  source: $_itemsDropdown,
  clock: searchItem,
  fn: (list, str) => list.filter((el) => el.title.toLowerCase().indexOf(str.toLowerCase()) !== -1),
  target: $itemsDropdown,
})
sample({
  source: $_itemsDropdown,
  clock: restoreItems,
  target: $itemsDropdown,
})
