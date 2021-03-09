import { createEvent, createStore, forward, attach, restore } from 'effector-root'
import { getLabelsListFx } from '@/features/api/assignment/get-labels-list'
import { DropdownItem } from '@/pages/common/types'

const getLabels = attach({
  effect: getLabelsListFx,
})

export const loadLabels = createEvent<void>()
export const $labels = createStore<DropdownItem[]>([])

export const setSelectedLabels = createEvent<DropdownItem[]>()
export const $selectedLabels = restore(setSelectedLabels, [])

forward({
  from: loadLabels,
  to: getLabels.prepend(() => ({})),
})

forward({
  from: getLabels.doneData.map((res) =>
    res.body.data.map((label) => ({ name: `${label.id}`, title: label.name }))
  ),
  to: $labels,
})
