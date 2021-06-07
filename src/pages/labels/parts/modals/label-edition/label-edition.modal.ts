import { errorToastEvent, successToastEvent } from '@/features/toasts/toasts.model'
import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
import {
  $selectedClass,
  classesDropdownModule,
  setSelectedClass,
} from '@/pages/common/dropdowns/class/classes-dropdown.model'
import {
  $selectedSubject,
  setSelectedSubject,
  subjectsDropdownModel,
} from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { condition } from 'patronum'
import {
  $selectedTheme,
  setSelectedTheme,
  themesDropdownModule,
} from '@/pages/common/dropdowns/themes-tree/theme-dropdown.model'
import { DEFAULT_ID } from '@/pages/common/constants'
import { getLabelFx } from '@/features/api/assignment/labels/get-label'
import { updateLabelFx } from '@/features/api/assignment/update-label'
import { getLabelsTreeLight } from '@/pages/labels/labels-page.model'
import { createError } from '@/lib/effector/error-generator'
import { setDataToUpdateTree } from '@/pages/common/parts/tree/data-to-update-tree/data-to-update-tree.model'
import { Label } from '@/features/api/assignment/types/types'

export const updateLabel = attach({
  effect: updateLabelFx,
})

const getLabel = attach({
  effect: getLabelFx,
})

export const loadModalToEdit = createEvent<number>()
export const checkIfThemeCanBeSend = createEvent<void>()
export const clearFields = createEvent<void>()

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

export const labelTitleChanged = createEvent<string>()
const labelTitleReset = createEvent<void>()
export const $labelTitle = restore(labelTitleChanged, '').reset(labelTitleReset)

export const $subjectErrorModule = createError()

export const $classErrorModule = createError()

export const $themeErrorModule = createError()

export const $titleErrorModule = createError()

const $form = combine({
  id: DEFAULT_ID,
  name: $labelTitle,
  study_year_id: $selectedClass.map((data) => (data ? +data.name : DEFAULT_ID)),
  subject_id: $selectedSubject.map((data) => (data ? +data.name : DEFAULT_ID)),
  theme_id: $selectedTheme.map((data) => (data ? +data.id! : DEFAULT_ID)),
})

sample({
  source: $form,
  clock: checkIfThemeCanBeSend,
  fn: (obj) => {
    if (
      obj.name.trim().length &&
      obj.study_year_id !== DEFAULT_ID &&
      obj.subject_id !== DEFAULT_ID &&
      obj.theme_id !== DEFAULT_ID
    ) {
      updateLabel(obj)
      setDataToUpdateTree({ subject: obj.subject_id, study_year: obj.study_year_id })
    } else {
      if (!obj.name.trim().length) $titleErrorModule.methods.setError(true)
      if (obj.study_year_id === DEFAULT_ID) $classErrorModule.methods.setError(true)
      if (obj.subject_id === DEFAULT_ID) $subjectErrorModule.methods.setError(true)
      if (obj.theme_id === DEFAULT_ID) $themeErrorModule.methods.setError(true)
      errorToastEvent('Необходимо заполнить все обязательные поля')
    }
  },
})

forward({
  from: labelTitleChanged,
  to: $titleErrorModule.methods.resetError,
})

forward({
  from: subjectsDropdownModel.methods.itemChanged,
  to: $subjectErrorModule.methods.resetError,
})

forward({
  from: classesDropdownModule.methods.itemChanged,
  to: $classErrorModule.methods.resetError,
})

forward({
  from: themesDropdownModule.methods.itemChanged,
  to: $themeErrorModule.methods.resetError,
})

forward({
  from: loadModalToEdit,
  to: [getLabel, modalVisibilityChanged.prepend(() => true)],
})

sample({
  clock: getLabel.doneData.map((data) => data.body),
  fn: (label: Label) => {
    $form.map((data) => (data.id = label.id))
    labelTitleChanged(label.name)
    label.subject && subjectsDropdownModel.methods.itemChanged(`${label.subject.id}`)
    label.subject &&
      setSelectedSubject({
        id: label.subject.id,
        name: `${label.subject.id}`,
        title: label.subject.name,
      })
    label.study_year && classesDropdownModule.methods.itemChanged(`${label.study_year.id}`)
    label.study_year &&
      setSelectedClass({
        id: label.study_year.id,
        name: `${label.study_year.id}`,
        title: label.study_year.name,
      })
    label.theme && themesDropdownModule.methods.itemChanged(`${label.theme.id}`)
    label.theme &&
      setSelectedTheme({
        id: label.theme.id,
        name: `${label.theme.id}`,
        title: label.theme.name,
      })
  },
})

forward({
  from: updateLabelFx.doneData,
  to: [
    successToastEvent('Метка была успешно обновлена!'),
    getLabelsTreeLight.prepend(() => ({})),
    modalVisibilityChanged.prepend(() => false),
  ],
})

condition({
  source: modalVisibilityChanged,
  if: (payload: boolean) => !payload,
  then: clearFields,
})

forward({
  from: clearFields,
  to: [
    labelTitleReset,
    subjectsDropdownModel.methods.resetDropdown,
    classesDropdownModule.methods.resetDropdown,
    setSelectedTheme.prepend(() => null),
    setSelectedClass.prepend(() => null),
    setSelectedSubject.prepend(() => null),
  ],
})
