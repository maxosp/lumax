import { createStore, attach, createEvent, forward, sample, restore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
// TODO: correctly define WHICH type of assignment
import { DEFAULT_ID } from '@/pages/common/constants'
import { getOlympiadDifficultyListFx } from '@/features/api/assignment/olympiad-assignment/get-olympiad-difficulty-list'

export const scoreDropdownModule = createFilter()

export const setSelectedScore = createEvent<DropdownItem | null>()
export const $selectedScore = restore(setSelectedScore, null)

const getScoresList = attach({
  effect: getOlympiadDifficultyListFx,
})

export const loadScores = createEvent<void>()
export const $scores = createStore<DropdownItem[]>([])

forward({
  from: loadScores,
  to: getScoresList.prepend(() => ({})),
})

forward({
  from: getScoresList.doneData.map((res) =>
    res.body.map((item) => ({ name: `${item.code}`, title: item.name }))
  ),
  to: $scores,
})

sample({
  clock: $scores,
  fn: (arr) => {
    arr.unshift({ name: `${DEFAULT_ID}`, title: 'Не менять' })
    return arr
  },
  target: $scores,
})
