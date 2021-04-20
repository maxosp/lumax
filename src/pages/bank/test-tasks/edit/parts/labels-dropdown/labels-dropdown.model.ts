import { createEvent, createStore, forward, attach, restore } from 'effector-root'
import { getLabelsListFx } from '@/features/api/assignment/labels/get-labels-list'
import { getTestAssignmentFx } from '@/features/api/assignment/test-assignment/get-test-assignment'
import { getLabelFx } from '@/features/api/assignment/labels/get-label'
import { DropdownItem } from '@/pages/common/types'

const getLabels = attach({
  effect: getLabelsListFx,
})

const loadAssignment = attach({
  effect: getTestAssignmentFx,
})

const loadLabelByID = attach({
  effect: getLabelFx,
})

export const loadLabels = createEvent<void>()
export const $labels = createStore<DropdownItem[]>([])

export const setSelectedLabels = createEvent<DropdownItem[]>()
export const $selectedLabels = restore(setSelectedLabels, [])

export const loadCurrentLabelsIDs = createEvent<number>()
export const $currentLabelsIDs = createStore<number[]>([])

export const loadCurrentLabels = createEvent<number>()
export const $currentLabel = createStore<any>({})

forward({
  from: loadLabels,
  to: getLabels.prepend(() => ({})),
})

forward({
  from: loadCurrentLabelsIDs,
  to: loadAssignment,
})

forward({
  from: loadCurrentLabels,
  to: loadLabelByID,
})

forward({
  from: getLabels.doneData.map((res) =>
    res.body.data.map((label) => ({ name: `${label.id}`, title: label.name }))
  ),
  to: $labels,
})

forward({
  from: loadAssignment.doneData.map(({ body }) => body.labels),
  to: $currentLabelsIDs,
})

forward({
  from: loadLabelByID.doneData.map(({ body }) => ({ name: body.id, title: body.name })),
  to: $currentLabel,
})
