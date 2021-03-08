import { getUserStudyYearsListFx } from '@/features/api/user/get-user-study-years-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { attach, createEvent, createStore, forward, restore } from 'effector-root'
import { DropdownItem, SelectedObjectType } from '@/pages/common/types'

export const classDropdownModule = createFilter()

export const setSelectedClass = createEvent<DropdownItem | SelectedObjectType | null>()
export const $selectedClass = restore(setSelectedClass, null)

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
    res.body.data.map((studyYear) => ({
      name: `${studyYear.number}`,
      title: studyYear.name,
      id: studyYear.id,
    }))
  ),
  to: $classes,
})
