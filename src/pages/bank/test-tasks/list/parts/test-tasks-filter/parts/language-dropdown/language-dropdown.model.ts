import { createStore, forward, attach, createEvent } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { getListLanguageFx } from '@/features/api/assignment/get-list-language'

export const languagesDropdownModule = createFilter()

const getLanguages = attach({
  effect: getListLanguageFx,
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
