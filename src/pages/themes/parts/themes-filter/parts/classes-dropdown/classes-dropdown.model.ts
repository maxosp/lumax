import { createEvent, createStore, forward, attach } from 'effector-root'
import { DropdownItem } from '@/pages/common/types'
import { getUserStudyYearsListFx } from '@/features/api/user/get-user-study-years-list'
import { GetListQueryParams } from '@/features/api/types'

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
