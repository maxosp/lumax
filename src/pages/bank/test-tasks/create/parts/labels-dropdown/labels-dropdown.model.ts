import { createEvent, createStore, forward, attach, restore, combine } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { $selectedSubject } from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { $selectedClass } from '@/pages/common/dropdowns/class/classes-dropdown.model'
import { debounce, every } from 'patronum'
import { $selectedTheme } from '@/pages/common/dropdowns/themes-tree/theme-dropdown.model'
import { getLabelsTreeFx } from '@/features/api/assignment/labels/get-labels-tree'

export const labelsDropdownModule = createFilter()

const getLabels = attach({
  effect: getLabelsTreeFx,
})

export const loadLabels = createEvent<void>()
export const $labels = createStore<DropdownItem[]>([])

export const setSelectedLabels = createEvent<DropdownItem[]>()
export const clearSelectedLabels = createEvent<void>()
export const $selectedLabels = restore(setSelectedLabels, [])

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
  from: getLabels.doneData.map((res) => res.body.data as unknown as DropdownItem[]),
  to: [$labels, labelsDropdownModule.methods.setItems],
})
