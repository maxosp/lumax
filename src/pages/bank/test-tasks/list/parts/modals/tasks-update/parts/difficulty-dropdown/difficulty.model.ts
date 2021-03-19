import { createStore, attach, createEvent, forward, sample, restore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
// TODO: correctly define WHICH type of assignment
import { getTestDifficultyListFx } from '@/features/api/assignment/test-assignment/get-test-difficulty-list'
import { DEFAULT_ID } from '@/pages/common/constants'

export const difficultyDropdownModule = createFilter()

export const setSelectedDifficulty = createEvent<DropdownItem | null>()
export const $selectedDifficulty = restore(setSelectedDifficulty, null)

const getDifficultysList = attach({
  effect: getTestDifficultyListFx,
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
