import { createEvent, createStore, forward, attach, restore, combine, merge } from 'effector-root'
import { debounce, every } from 'patronum'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
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

export const labelsDropdownModule = createFilter()

const getLabels = attach({
  effect: getLabelsListFx,
})

export const loadLabels = createEvent<void>()
export const $labels = createStore<DropdownItem[]>([])

const resetLabels = merge([setSelectedClass, setSelectedSubject, setSelectedTheme])

export const setSelectedLabels = createEvent<DropdownItem[]>()
export const clearSelectedLabels = createEvent<void>()
export const $selectedLabels = restore(setSelectedLabels, []).reset(
  resetLabels,
  clearSelectedLabels
)

export const $canSetLabels = every({
  predicate: (value) => value !== null,
  stores: [$selectedSubject, $selectedClass, $selectedTheme],
})

const $formToGetLabelsList = combine(
  $selectedClass,
  $selectedSubject,
  $selectedTheme,
  (cls, subject, theme) => ({
    study_year: cls && +cls.name,
    subject: subject && +subject.name,
    theme: theme && +theme.name,
  })
)

const debounced = debounce({
  source: $formToGetLabelsList,
  timeout: 150,
})

forward({
  from: debounced,
  to: [
    getLabels.prepend((data) => {
      return {
        study_year: data.study_year ? data.study_year : undefined,
        subject: data.subject ? data.subject : undefined,
        theme: data.theme ? data.theme : undefined,
        is_prerequisite: false,
      }
    }),
  ],
})

forward({
  from: loadLabels,
  to: getLabels.prepend(() => ({})),
})

forward({
  from: getLabels.doneData.map((res) =>
    (res.body.data as unknown as DropdownItem[]).map((label) => {
      return {
        ...label,
        title: label.name,
      }
    })
  ),
  to: [$labels, labelsDropdownModule.methods.setItems],
})
