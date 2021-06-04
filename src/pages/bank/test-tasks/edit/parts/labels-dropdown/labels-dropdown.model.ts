import { createEvent, createStore, forward, attach, restore, merge } from 'effector-root'
import { getLabelsListFx } from '@/features/api/assignment/labels/get-labels-list'
import { getTestAssignmentFx } from '@/features/api/assignment/test-assignment/get-test-assignment'
import { getLabelFx } from '@/features/api/assignment/labels/get-label'
import { DropdownItem } from '@/pages/common/types'
import { setSelectedClass } from '@/pages/common/dropdowns/class/classes-dropdown.model'
import { setSelectedSubject } from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { setSelectedTheme } from '@/pages/common/dropdowns/themes-tree/theme-dropdown.model'

export const getLabels = attach({
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
export const clearSelectedLabels = createEvent<void>()
const resetLabels = merge([setSelectedClass, setSelectedSubject, setSelectedTheme])
export const $selectedLabels = restore(setSelectedLabels, []).reset(
  resetLabels,
  clearSelectedLabels
)

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
