import { createStore, attach, createEvent, forward } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { getOlympiadsListDifficultyFx } from '@/features/api/assignment/get-olympiads-list-difficulty'

export const difficultyDropdownModule = createFilter()

const getDifficultys = attach({
  effect: getOlympiadsListDifficultyFx,
})

export const loadDifficultys = createEvent<void>()
export const $difficultys = createStore<DropdownItem[]>([])

forward({
  from: loadDifficultys,
  to: getDifficultys.prepend(() => ({})),
})

forward({
  from: getDifficultys.doneData.map((res) =>
    res.body.map((item) => ({ name: `${item.code}`, title: item.name }))
  ),
  to: $difficultys,
})
