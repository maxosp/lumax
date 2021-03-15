import { createEvent, createStore, forward, attach, restore } from 'effector-root'
import { getTestDifficultyListFx } from '@/features/api/assignment/test-assignment/get-test-difficulty-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'

export const difficultiesDropdownModule = createFilter()

export const setSelectedDifficulty = createEvent<DropdownItem | null>()
export const $selectedDifficulty = restore(setSelectedDifficulty, null)

const getDifficulties = attach({
  effect: getTestDifficultyListFx,
})

export const loadDifficulties = createEvent<void>()
export const $difficulties = createStore<DropdownItem[]>([])

forward({
  from: loadDifficulties,
  to: getDifficulties.prepend(() => ({})),
})

forward({
  from: getDifficulties.doneData.map((res) =>
    res.body.map((diff) => ({ name: `${diff.code}`, title: diff.name }))
  ),
  to: $difficulties,
})
