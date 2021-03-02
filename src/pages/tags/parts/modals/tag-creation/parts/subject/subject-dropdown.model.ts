import { attach, createEvent, createStore, forward, restore } from 'effector-root'
import { getSubjectsListFx } from '@/features/api/subject/get-subjects-list'
import { GetListQueryParams } from '@/features/api/types'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'

export const subjectDropdownModule = createFilter()

export const setSelectedSubject = createEvent<DropdownItem | null>()
export const $selectedSubject = restore(setSelectedSubject, null)

const getSubjects = attach({
  effect: getSubjectsListFx,
  mapParams: (params: GetListQueryParams) => params,
})

export const loadSubjects = createEvent<void>()
export const $subjects = createStore<DropdownItem[]>([])

forward({
  from: loadSubjects,
  to: getSubjects.prepend(() => ({})),
})

forward({
  from: getSubjects.doneData.map((res) =>
    res.body.data.map((subject) => ({
      name: `${subject.id}`,
      title: subject.name,
      author: subject.author,
      color: subject.color,
      icon: subject.icon,
      is_mandatory: subject.is_mandatory,
    }))
  ),
  to: $subjects,
})
