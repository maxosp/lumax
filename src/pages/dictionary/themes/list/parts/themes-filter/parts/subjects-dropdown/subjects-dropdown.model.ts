import { createEvent, createStore, forward, attach } from 'effector-root'
import { getSubjectsListFx } from '@/features/api/subject/get-subjects-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { GetListQueryParams } from '@/features/api/types'
import { DropdownItem } from '@/pages/common/types'

export const subjectsDropdownModule = createFilter()

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
    res.body.data.map((subject) => ({ name: `${subject.id}`, title: subject.name }))
  ),
  to: $subjects,
})
