import { createStore, forward, attach, createEvent } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { getTestLanguageListFx } from '@/features/api/assignment/test-assignment/get-test-language-list'

export const languagesDropdownModule = createFilter()

const getLanguages = attach({
  effect: getTestLanguageListFx,
})

export const loadLanguages = createEvent<void>()
export const $languages = createStore<DropdownItem[]>([])

forward({
  from: loadLanguages,
  to: getLanguages.prepend(() => ({})),
})

forward({
  from: getLanguages.doneData.map((res) =>
    res.body.map((item) => ({ name: item.name, title: item.name }))
  ),
  to: $languages,
})
