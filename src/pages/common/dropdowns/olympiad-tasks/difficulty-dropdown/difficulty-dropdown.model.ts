import { createStore, attach, createEvent, forward } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { getOlympiadDifficultyListFx } from '@/features/api/assignment/olympiad-assignment/get-olympiad-difficulty-list'

export const difficultyDropdownModule = createFilter()

const getDifficultys = attach({
  effect: getOlympiadDifficultyListFx,
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
