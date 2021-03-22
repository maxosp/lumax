import { createStore, attach, createEvent, forward, restore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { getTestDifficultyListFx } from '@/features/api/assignment/test-assignment/get-test-difficulty-list'

export const difficultyDropdownModule = createFilter()

const getDifficultys = attach({
  effect: getTestDifficultyListFx,
})

export const setSelectedDifficulty = createEvent<DropdownItem | null>()
export const $selectedDifficulty = restore(setSelectedDifficulty, null)

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
