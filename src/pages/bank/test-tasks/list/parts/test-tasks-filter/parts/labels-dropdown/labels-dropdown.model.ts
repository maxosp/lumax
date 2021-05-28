import { createEvent, createStore, forward, attach } from 'effector-root'
import { getLabelsListFx } from '@/features/api/assignment/labels/get-labels-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'

export const labelsDropdownModule = createFilter()

export const getLabels = attach({
  effect: getLabelsListFx,
})

export const loadLabels = createEvent<void>()
export const $labels = createStore<DropdownItem[]>([])

forward({
  from: loadLabels,
  to: getLabels.prepend(() => ({})),
})

forward({
  from: getLabels.doneData.map((res) =>
    res.body.data.map((subject) => ({ name: `${subject.id}`, title: subject.name }))
  ),
  to: $labels,
})
