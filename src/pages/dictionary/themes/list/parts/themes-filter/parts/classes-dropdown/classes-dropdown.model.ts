import { createEvent, createStore, forward, attach } from 'effector-root'
import { getUserStudyYearsListFx } from '@/features/api/user/get-user-study-years-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'

export const classesDropdownModule = createFilter()

const getClasses = attach({
  effect: getUserStudyYearsListFx,
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
