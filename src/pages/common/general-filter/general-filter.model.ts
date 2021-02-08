import { createEvent, restore } from 'effector-root'
import { DropdownItem } from '@/pages/common/types'

export const reset = createEvent<void>()

export const searchStringChanged = createEvent<string>()
export const $searchString = restore(searchStringChanged, '').reset(reset)

export const searchFieldChanged = createEvent<DropdownItem>()
export const $searchField = restore(searchFieldChanged, {
  name: 'all',
  title: 'Искать везде',
}).reset(reset)
