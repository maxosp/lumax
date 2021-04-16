import { createStore, attach, createEvent, forward, restore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { getTestDifficultyListFx } from '@/features/api/test/get-test-difficulty-list'

export const difficultyDropdownModule = createFilter()

const getDifficulties = attach({
  effect: getTestDifficultyListFx,
})

export const setSelectedDifficulty = createEvent<DropdownItem | null>()
export const $selectedDifficulty = restore(setSelectedDifficulty, null)

export const loadDifficulties = createEvent<void>()
export const $difficulties = createStore<DropdownItem[]>([])

forward({
  from: loadDifficulties,
  to: getDifficulties,
})

forward({
  from: getDifficulties.doneData.map((res) =>
    res.body.map((item) => ({ name: `${item.code}`, title: `Тест ${item.name}` }))
  ),
  to: $difficulties,
})
