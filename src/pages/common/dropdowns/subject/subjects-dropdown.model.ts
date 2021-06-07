import { createEvent, forward, attach, restore, sample } from 'effector-root'
import { getSubjectsListFx } from '@/features/api/subject/get-subjects-list'
import { DropdownItem } from '@/pages/common/types'
import { GetListQueryParams } from '@/features/api/types'
import { createDropdownModel } from '@/pages/common/filters/create-dropdown-model'
import { SubjectGrid } from '@/features/api/subject/types'

const getSubjects = attach({
  effect: getSubjectsListFx,
})

export const subjectsDropdownModel = createDropdownModel<SubjectGrid>(getSubjects)

export const setSelectedSubject = createEvent<DropdownItem | null>()
export const $selectedSubject = restore(setSelectedSubject, null)

export const loadSubjects = createEvent<void>()

sample({
  clock: loadSubjects,
  source: { $nextPage: subjectsDropdownModel.store.$nextPage },
  fn: (params): GetListQueryParams => ({
    page: params.$nextPage,
  }),
  target: getSubjects,
})

forward({
  from: subjectsDropdownModel.methods.canLoadNextPage,
  to: loadSubjects,
})

sample({
  clock: getSubjects.doneData,
  source: { items: subjectsDropdownModel.store.$items },
  fn: ({ items }, res) => {
    const newData = res.body.data.map((field) => ({
      name: `${field.id}`,
      title: field.name,
    }))
    return [...items, ...newData]
  },
  target: subjectsDropdownModel.store.$items,
})

forward({
  from: subjectsDropdownModel.methods.resetDropdown,
  to: setSelectedSubject.prepend(() => null),
})
