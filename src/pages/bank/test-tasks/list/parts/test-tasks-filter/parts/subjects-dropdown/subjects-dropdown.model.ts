import { createEvent, createStore, forward, attach, restore } from 'effector-root'
import { getSubjectsListFx } from '@/features/api/subject/get-subjects-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'

export const subjectsDropdownModule = createFilter()

export const setSelectedSubject = createEvent<DropdownItem | null>()
export const $selectedSubject = restore(setSelectedSubject, null)

const getSubjects = attach({
  effect: getSubjectsListFx,
})

export const loadSubjects = createEvent<void>()
export const $subjects = createStore<DropdownItem[]>([])

forward({
  from: loadSubjects,
  to: getSubjects.prepend(() => ({})),
})

forward({
  from: getSubjects.doneData.map((res) =>
    res.body.data.map((subject) => ({ name: `${subject.id}`, title: subject.name }))
  ),
  to: $subjects,
})
