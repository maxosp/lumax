import { createEvent, createStore, forward, attach, restore } from 'effector-root'
import { getUserStudyYearsListFx } from '@/features/api/user/get-user-study-years-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { GetListQueryParams } from '@/features/api/types'

export const classesDropdownModule = createFilter()

export const setSelectedClass = createEvent<DropdownItem | null>()
export const $selectedClass = restore(setSelectedClass, null)

const getClasses = attach({
  effect: getUserStudyYearsListFx,
  mapParams: (params: GetListQueryParams) => params,
})

export const loadClasses = createEvent<void>()
export const $classes = createStore<DropdownItem[]>([])

forward({
  from: loadClasses,
  to: getClasses.prepend(() => ({})),
})

forward({
  from: getClasses.doneData.map((res) =>
    res.body.data.map((studyYear) => ({ name: `${studyYear.id}`, title: studyYear.name }))
  ),
  to: $classes,
})
