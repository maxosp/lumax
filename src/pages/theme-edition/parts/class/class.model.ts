import { GetListQueryParams } from '@/features/api/types'
import { getUserStudyYearsListFx } from '@/features/api/user/get-user-study-years-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { attach, createEvent, createStore, forward } from 'effector-root'
import { DropdownItem } from '@/pages/common/types'

export const classDropdownModule = createFilter()

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
    res.body.data.map((studyYear) => ({
      name: `${studyYear.number}`,
      title: studyYear.name,
      id: studyYear.id,
    }))
  ),
  to: $classes,
})
