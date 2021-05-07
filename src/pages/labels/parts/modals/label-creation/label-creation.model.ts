import { errorToastEvent, successToastEvent } from '@/features/toasts/toasts.model'
import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
import {
  $selectedClass,
  classDropdownModule,
  setSelectedClass,
} from '@/pages/labels/parts/modals/label-creation/parts/class/class-dropdown.model'
import {
  $selectedSubject,
  setSelectedSubject,
  subjectDropdownModule,
} from '@/pages/labels/parts/modals/label-creation/parts/subject/subject-dropdown.model'
import {
  $selectedTheme,
  setSelectedTheme,
  themesDropdownModule,
} from '@/pages/common/dropdowns/themes-tree/theme-dropdown.model'
import { condition, debounce, every } from 'patronum'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'
import { createLabelFx } from '@/features/api/assignment/labels/create-label'
import { getLabelsTreeLight } from '@/pages/labels/labels-page.model'
import { DEFAULT_ID } from '@/pages/common/constants'
import { createError } from '@/lib/effector/error-generator'
import { setDataToUpdateTree } from '@/pages/common/parts/tree/data-to-update-tree/data-to-update-tree.model'

export const createLabel = attach({
  effect: createLabelFx,
})

export const createLabelFromTree = createEvent<{
  class_id: number
  subject_id: number
  theme_id: number
}>()

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

const $formToGetThemeList = combine($selectedClass, $selectedSubject, (cl, obj) => ({
  study_year: cl && cl.id,
  subject: obj && obj.id,
}))

const debounced = debounce({
  source: $formToGetThemeList,
  timeout: 150,
})

forward({
  from: debounced,
  to: [
    getThemesTreeListFx.prepend((data) => {
      return {
        study_year: data.study_year ? data.study_year : undefined,
        subject: data.subject ? data.subject : undefined,
        is_prerequisite: false,
      }
    }),
  ],
})

export const $canSetThemePosition = every({
  predicate: (value) => value !== null,
  stores: [$selectedSubject, $selectedClass],
})

const $form = combine({
  name: $labelTitle,
  study_year_id: $selectedClass.map((data) => (data && data.id ? +data.id : DEFAULT_ID)),
  subject_id: $selectedSubject.map((data) => (data && data.id ? +data.id : DEFAULT_ID)),
  theme_id: $selectedTheme.map((data) => (data && data.id ? +data.id : DEFAULT_ID)),
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
      createLabel(obj)
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

sample({
  clock: createLabelFromTree,
  fn: (label: { class_id: number; subject_id: number; theme_id: number }) => {
    classDropdownModule.methods.itemChanged(`${label.class_id}`)
    setSelectedClass({ id: label.class_id })
    subjectDropdownModule.methods.itemChanged(`${label.subject_id}`)
    setSelectedSubject({ id: label.subject_id })
    themesDropdownModule.methods.itemChanged(`${label.theme_id}`)
    setSelectedTheme({ id: label.theme_id })
    modalVisibilityChanged(true)
  },
})

forward({
  from: labelTitleChanged,
  to: $titleErrorModule.methods.resetError,
})

forward({
  from: subjectDropdownModule.methods.itemChanged,
  to: $subjectErrorModule.methods.resetError,
})

forward({
  from: classDropdownModule.methods.itemChanged,
  to: $classErrorModule.methods.resetError,
})

forward({
  from: themesDropdownModule.methods.itemChanged,
  to: $themeErrorModule.methods.resetError,
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
    subjectDropdownModule.methods.resetDropdown,
    classDropdownModule.methods.resetDropdown,
    themesDropdownModule.methods.resetDropdown,
    $titleErrorModule.methods.resetError,
    $subjectErrorModule.methods.resetError,
    $classErrorModule.methods.resetError,
    $themeErrorModule.methods.resetError,
    setSelectedClass.prepend(() => null),
    setSelectedSubject.prepend(() => null),
    setSelectedTheme.prepend(() => null),
  ],
})

forward({
  from: createLabelFx.doneData,
  to: [
    successToastEvent('Метка была успешно создана!'),
    getLabelsTreeLight.prepend(() => ({})),
    modalVisibilityChanged.prepend(() => false),
  ],
})
