import { createEvent, restore } from 'effector-root'
import { SearchField } from '@/pages/themes/types'
import { searchFieldsData } from '@/pages/themes/constants'

export const reset = createEvent<void>()

export const searchStringChanged = createEvent<string>()
export const $searchString = restore(searchStringChanged, '').reset(reset)

export const searchFieldChanged = createEvent<SearchField>()
export const $searchField = restore(searchFieldChanged, searchFieldsData[0]).reset(reset)
