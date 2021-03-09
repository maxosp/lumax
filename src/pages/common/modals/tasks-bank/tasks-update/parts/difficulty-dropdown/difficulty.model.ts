import { createStore, attach, createEvent, forward, sample } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { getListDifficultyFx } from '@/features/api/assignment/get-list-difficulty'
import { DEFAULT_ID } from '@/pages/bank/olympiad-tasks/constants'

export const difficultyDropdownModule = createFilter()

const getDifficultysList = attach({
  effect: getListDifficultyFx,
})

export const loadDifficultys = createEvent<void>()
export const $difficultys = createStore<DropdownItem[]>([])

forward({
  from: loadDifficultys,
  to: getDifficultysList.prepend(() => ({})),
})

forward({
  from: getDifficultysList.doneData.map((res) =>
    res.body.map((item) => ({ name: `${item.code}`, title: item.name }))
  ),
  to: $difficultys,
})

sample({
  clock: $difficultys,
  fn: (arr) => {
    arr.unshift({ name: `${DEFAULT_ID}`, title: 'Не менять сложность' })
    return arr
  },
  target: $difficultys,
})
