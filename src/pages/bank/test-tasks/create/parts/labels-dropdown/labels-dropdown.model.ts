import { createEvent, forward, attach, restore, merge, sample, guard } from 'effector-root'
import { every } from 'patronum'
import { DropdownItem } from '@/pages/common/types'
import {
  $selectedSubject,
  setSelectedSubject,
} from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import {
  $selectedClass,
  setSelectedClass,
} from '@/pages/common/dropdowns/class/classes-dropdown.model'
import {
  $selectedTheme,
  setSelectedTheme,
} from '@/pages/common/dropdowns/themes-tree/theme-dropdown.model'
import { getLabelsListFx } from '@/features/api/assignment/labels/get-labels-list'
import { createDropdownModel } from '@/pages/common/filters/create-dropdown-model'
import { GetListQueryParams } from '@/features/api/types'
import { Label } from '@/features/api/assignment/types/types'

const getLabels = attach({
  effect: getLabelsListFx,
})

export const labelsDropdownModule = createDropdownModel<Label>(getLabels)

export const $canSetLabels = every({
  predicate: (value) => value !== null,
  stores: [$selectedSubject, $selectedClass, $selectedTheme],
})

export const loadLabels = createEvent<void>()

sample({
  clock: loadLabels,
  source: {
    $nextPage: labelsDropdownModule.store.$nextPage,
    $selectedClass,
    $selectedSubject,
    $selectedTheme,
  },
  fn: (params): GetListQueryParams => ({
    page: params.$nextPage,
    study_year: params.$selectedClass!.id || null,
    subject: params.$selectedSubject!.id || null,
    theme: params.$selectedTheme!.id || null,
    is_prerequisite: false,
  }),
  target: getLabels,
})

guard({
  clock: [$selectedSubject, $selectedClass, $selectedTheme],
  source: $canSetLabels,
  filter: (canSetLabels) => canSetLabels,
  target: loadLabels,
})

forward({
  from: labelsDropdownModule.methods.canLoadNextPage,
  to: loadLabels,
})

sample({
  clock: getLabels.doneData,
  fn: (res) => {
    return [
      ...res.body.data.map((field) => ({
        name: `${field.id}`,
        title: field.name,
      })),
    ]
  },
  target: labelsDropdownModule.store.$items,
})

const resetLabels = merge([setSelectedClass, setSelectedSubject, setSelectedTheme])

forward({
  from: resetLabels,
  to: labelsDropdownModule.methods.resetDropdown,
})

export const setSelectedLabels = createEvent<DropdownItem[]>()
export const clearSelectedLabels = createEvent<void>()
export const $selectedLabels = restore(setSelectedLabels, []).reset(
  resetLabels,
  clearSelectedLabels
)
