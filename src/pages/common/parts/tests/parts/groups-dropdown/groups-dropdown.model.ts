import { createEvent, createStore, forward, attach, restore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { getSubjectsListFx } from '@/features/api/subject/get-subjects-list'
import { Datetime } from '@/features/api/test/types'

export const groupsDropdownModule = createFilter()

const getGroups = attach({
  effect: getSubjectsListFx,
})

export const loadGroups = createEvent<void>()
export const $groups = createStore<DropdownItem[]>([])

export const setSelectedGroups = createEvent<any[]>()
export const $selectedGroups = restore(setSelectedGroups, [])

export const setDatetime = createEvent<Datetime[]>()
export const $datetimes = restore(setDatetime, [
  {
    id: 0,
    start: null,
    end: null,
  },
])

forward({
  from: loadGroups,
  to: getGroups.prepend(() => ({})),
})

forward({
  from: getGroups.doneData.map((res) =>
    res.body.data.map((group, index) => ({
      id: index,
      name: `${group.id}`,
      title: group.name,
      datetimes: [
        {
          id: 0,
          start: null,
          end: null,
        },
      ],
    }))
  ),
  to: [$groups, groupsDropdownModule.methods.setItems],
})
