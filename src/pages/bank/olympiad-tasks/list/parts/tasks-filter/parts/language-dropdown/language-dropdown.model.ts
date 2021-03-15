import { createStore, forward, attach, createEvent } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
// TODO: correctly define WHICH type of assignment
import { getTestLanguageListFx } from '@/features/api/assignment/test-assignment/get-test-language-list'
import { DropdownItem } from '@/pages/common/types'

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
    res.body.map((item) => ({ name: `${item.code}`, title: item.name }))
  ),
  to: $languages,
})
