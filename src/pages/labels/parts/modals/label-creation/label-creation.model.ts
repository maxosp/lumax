import { addToast } from '@/features/toasts/toasts.model'
import { attach, combine, createEvent, forward, restore, sample, split } from 'effector-root'
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
} from '@/pages/labels/parts/modals/label-creation/parts/theme/theme-dropdown.model'
import { condition, debounce, every } from 'patronum'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'
import { createLabelFx } from '@/features/api/assignment/create-label'
import { CreateLabelType } from '@/features/api/assignment/types'
import { getLabelsTree } from '@/pages/labels/labels-page.model'
import { DEFAULT_ID } from '@/pages/labels/constants'

export const createLabel = attach({
  effect: createLabelFx,
  mapParams: (params: CreateLabelType) => params,
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

const subjectErrorChanged = createEvent<boolean>()
export const $subjectError = restore(subjectErrorChanged, false)

const classErrorChanged = createEvent<boolean>()
export const $classError = restore(classErrorChanged, false)

const themeErrorChanged = createEvent<boolean>()
export const $themeError = restore(themeErrorChanged, false)

const titleErrorChanged = createEvent<boolean>()
export const $titleError = restore(titleErrorChanged, false)

const $formToGetThemeList = combine($selectedClass, $selectedSubject, (cl, obj) => ({
  study_year: cl && +cl.name,
  subject: obj && +obj.name,
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
  study_year_id: $selectedClass.map((data) => (data ? +data.name : DEFAULT_ID)),
  subject_id: $selectedSubject.map((data) => (data ? +data.name : DEFAULT_ID)),
  theme_id: $selectedTheme.map((data) => (data ? +data.name : DEFAULT_ID)),
})

sample({
  source: $form,
  clock: checkIfThemeCanBeSend,
  fn: (obj) => {
    if (obj.name.trim().length && obj.study_year_id && obj.subject_id && obj.theme_id)
      createLabel(obj)
    else {
      if (!obj.name.trim().length) titleErrorChanged(true)
      if (!obj.study_year_id) classErrorChanged(true)
      if (!obj.subject_id) subjectErrorChanged(true)
      if (!obj.theme_id) themeErrorChanged(true)
      addToast({ type: 'error', message: 'Необходимо заполнить все обязательные поля' })
    }
  },
})

sample({
  clock: createLabelFromTree,
  fn: (label: { class_id: number; subject_id: number; theme_id: number }) => {
    classDropdownModule.methods.itemChanged(`${label.class_id}`)
    subjectDropdownModule.methods.itemChanged(`${label.subject_id}`)
    themesDropdownModule.methods.itemChanged(`${label.theme_id}`)
    modalVisibilityChanged(true)
  },
})

forward({
  from: labelTitleChanged,
  to: titleErrorChanged.prepend(() => false),
})

forward({
  from: subjectDropdownModule.methods.itemChanged,
  to: subjectErrorChanged.prepend(() => false),
})

forward({
  from: classDropdownModule.methods.itemChanged,
  to: classErrorChanged.prepend(() => false),
})

forward({
  from: themesDropdownModule.methods.itemChanged,
  to: themeErrorChanged.prepend(() => false),
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
    subjectDropdownModule.methods.resetItem,
    subjectDropdownModule.methods.resetSearchString,
    classDropdownModule.methods.resetItem,
    classDropdownModule.methods.resetSearchString,
    themesDropdownModule.methods.resetItem,
    themesDropdownModule.methods.resetSearchString,
    titleErrorChanged.prepend(() => false),
    subjectErrorChanged.prepend(() => false),
    classErrorChanged.prepend(() => false),
    themeErrorChanged.prepend(() => false),
    setSelectedClass.prepend(() => null),
    setSelectedSubject.prepend(() => null),
    setSelectedTheme.prepend(() => null),
  ],
})

const { noInternetConnection } = split(createLabelFx.failData, {
  noInternetConnection: ({ status }) => status === undefined,
})

forward({
  from: noInternetConnection,
  to: addToast.prepend(() => ({ type: 'no-internet', message: 'Отсутствует подключение' })),
})

forward({
  from: createLabelFx.doneData,
  to: [
    addToast.prepend(() => ({ type: 'success', message: 'Метка была успешно создана!' })),
    getLabelsTree.prepend(() => ({})),
    modalVisibilityChanged.prepend(() => false),
  ],
})
