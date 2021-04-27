import { createEvent, createStore, forward, attach } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { getLessonCourseListFx } from '@/features/api/assignment/lesson-assignment/get-lesson-cource-list'

export const courseDropdownModule = createFilter()

const getCourses = attach({
  effect: getLessonCourseListFx,
})

export const loadCourses = createEvent<void>()
export const $courses = createStore<DropdownItem[]>([])

forward({
  from: loadCourses,
  to: getCourses.prepend(() => ({})),
})

forward({
  from: getCourses.doneData.map((res) =>
    res.body.map((item) => ({ name: `${item.code}`, title: item.name }))
  ),
  to: $courses,
})
