import { createStore, attach, createEvent, forward, restore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
// TODO: correctly define WHICH type of assignment
import { getLessonScoreListFx } from '@/features/api/assignment/lesson-assignment/get-lesson-score-list'

export const scoreDropdownModule = createFilter()

export const setSelectedScore = createEvent<DropdownItem | null>()
export const $selectedScore = restore(setSelectedScore, null)

const getScoresList = attach({
  effect: getLessonScoreListFx,
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
