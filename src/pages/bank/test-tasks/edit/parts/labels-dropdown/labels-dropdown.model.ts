import { createEvent, createStore, forward, attach, restore, sample } from 'effector-root'
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
export const resetLabels = createEvent<void>()
export const $selectedLabels = restore(setSelectedLabels, []).reset(resetLabels)

export const loadCurrentLabelsIDs = createEvent<number>()
export const setCurrentLabelsIds = createEvent<number[]>()
export const $currentLabelsIDs = restore(setCurrentLabelsIds, []).reset(resetLabels)

export const loadCurrentLabels = createEvent<number>()
export const $currentLabel = createStore<any>({})

const setTaskId = createEvent<number>()
const $taskId = restore(setTaskId, null)

forward({
  from: loadLabels,
  to: getLabels.prepend(() => ({})),
})

forward({
  from: loadCurrentLabelsIDs,
  to: [loadAssignment, setTaskId],
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

sample({
  source: $taskId,
  clock: loadAssignment.doneData.map((data) => data.body),
  fn: (taskId, data) => {
    if (data.id === taskId) return data.labels
    return []
  },
  target: setCurrentLabelsIds,
})

forward({
  from: loadLabelByID.doneData.map(({ body }) => ({ name: body.id, title: body.name })),
  to: $currentLabel,
})
