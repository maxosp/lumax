import { createEvent, createStore, forward, attach } from 'effector-root'
import { getUserStudyYearsListFx } from '@/features/api/user/get-user-study-years-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { GetListQueryParams } from '@/features/api/types'

export const difficultyDropdownModule = createFilter()

const getClasses = attach({
  effect: getUserStudyYearsListFx,
  mapParams: (params: GetListQueryParams) => params,
})

export const loadDifficulty = createEvent<void>()
export const $difficulty = createStore<DropdownItem[]>([])

forward({
  from: loadDifficulty,
  to: getClasses.prepend(() => ({})),
})

forward({
  from: getClasses.doneData.map((res) =>
    res.body.data.map((studyYear) => ({ name: `${studyYear.id}`, title: studyYear.name }))
  ),
  to: $difficulty,
})
