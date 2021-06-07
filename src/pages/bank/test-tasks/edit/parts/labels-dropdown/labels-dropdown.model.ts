import { createEvent, createStore, forward, attach, restore, sample, guard } from 'effector-root'
import { getLabelsListFx } from '@/features/api/assignment/labels/get-labels-list'
import { getTestAssignmentFx } from '@/features/api/assignment/test-assignment/get-test-assignment'
import { getLabelFx } from '@/features/api/assignment/labels/get-label'
import { DropdownItem } from '@/pages/common/types'
import { createDropdownModel } from '@/pages/common/filters/create-dropdown-model'
import { Label } from '@/features/api/assignment/types/types'
import { every } from 'patronum'
import { $selectedSubject } from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { $selectedClass } from '@/pages/common/dropdowns/class/classes-dropdown.model'
import { $selectedTheme } from '@/pages/common/dropdowns/themes-tree/theme-dropdown.model'
import { GetListQueryParams } from '@/features/api/types'

export const getLabels = attach({
  effect: getLabelsListFx,
})

const loadAssignment = attach({
  effect: getTestAssignmentFx,
})

const loadLabelByID = attach({
  effect: getLabelFx,
})

export const labelsDropdownModule = createDropdownModel<Label>(getLabels)

export const $canSetLabels = every({
  predicate: (value) => value !== null,
  stores: [$selectedSubject, $selectedClass, $selectedTheme],
})

export const loadLabels = createEvent<void>()
const canLoadLabels = createEvent<void>()

guard({
  clock: loadLabels,
  source: [labelsDropdownModule.store.$nextPage, $selectedClass, $selectedSubject, $selectedTheme],
  filter: (sources) =>
    sources.every((source) => {
      if (typeof source === 'number') {
        return source
      }
      return source?.name
    }),
  target: canLoadLabels,
})

guard({
  clock: [$selectedSubject, $selectedClass, $selectedTheme],
  source: $canSetLabels,
  filter: (canSetLabels) => canSetLabels,
  target: loadLabels,
})

sample({
  clock: canLoadLabels,
  source: {
    $nextPage: labelsDropdownModule.store.$nextPage,
    $selectedClass,
    $selectedSubject,
    $selectedTheme,
  },
  fn: (params): GetListQueryParams => ({
    page: params.$nextPage,
    study_year: +params.$selectedClass!.name,
    subject: +params.$selectedSubject!.name,
    theme: +params.$selectedTheme!.name,
    is_prerequisite: false,
  }),
  target: getLabels,
})

forward({
  from: labelsDropdownModule.methods.canLoadNextPage,
  to: canLoadLabels,
})

sample({
  clock: getLabels.doneData,
  source: { items: labelsDropdownModule.store.$items },
  fn: ({ items }, res) => {
    const newData = res.body.data.map((field) => ({
      name: `${field.id}`,
      title: field.name,
    }))
    return [...items, ...newData]
  },
  target: labelsDropdownModule.store.$items,
})

export const setSelectedLabels = createEvent<DropdownItem[]>()
export const resetLabels = createEvent<void>()
export const $selectedLabels = restore(setSelectedLabels, []).reset(resetLabels)

export const loadCurrentLabelsIDs = createEvent<number>()
export const $currentLabelsIDs = createStore<number[]>([])

export const loadCurrentLabels = createEvent<number>()
export const $currentLabel = createStore<any>({})

forward({
  from: loadCurrentLabelsIDs,
  to: loadAssignment,
})

forward({
  from: loadCurrentLabels,
  to: loadLabelByID,
})

forward({
  from: loadAssignment.doneData.map(({ body }) => body.labels),
  to: $currentLabelsIDs,
})

forward({
  from: loadLabelByID.doneData.map(({ body }) => ({ name: body.id, title: body.name })),
  to: $currentLabel,
})
