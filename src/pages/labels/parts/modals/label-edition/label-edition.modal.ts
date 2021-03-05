import { addToast } from '@/features/toasts/toasts.model'
import { attach, combine, createEvent, forward, merge, restore, sample, split } from 'effector-root'
import {
  $selectedClass,
  classDropdownModule,
  setSelectedClass,
} from '@/pages/labels/parts/modals/label-edition/parts/class/class-dropdown.model'
import {
  $selectedSubject,
  setSelectedSubject,
  subjectDropdownModule,
} from '@/pages/labels/parts/modals/label-edition/parts/subject/subject-dropdown.model'
import { condition, debounce, every } from 'patronum'
import {
  $selectedTheme,
  setSelectedTheme,
  themesDropdownModule,
} from '@/pages/labels/parts/modals/label-edition/parts/theme/theme-dropdown.model'
import { DEFAULT_ID } from '@/pages/labels/constants'
import { getLabelFx } from '@/features/api/assignment/get-label'
import { CreateLabelType, Label } from '@/features/api/assignment/types'
import { updateLabelFx } from '@/features/api/assignment/update-label'
import { getLabelsTreeFx } from '@/features/api/assignment/get-labels-tree'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'
import { getLabelsTree } from '@/pages/labels/labels-page.model'

export const updateLabel = attach({
  effect: updateLabelFx,
  mapParams: (params: CreateLabelType) => params,
})

export const loadModalToEdit = createEvent<number>()
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

const $form = combine({
  id: DEFAULT_ID,
  name: $labelTitle,
  study_year_id: $selectedClass.map((data) => (data ? +data.name : DEFAULT_ID)),
  subject_id: $selectedSubject.map((data) => (data ? +data.name : DEFAULT_ID)),
  theme_id: $selectedTheme.map((data) => (data ? +data.name : DEFAULT_ID)),
})

export const $canSetThemePosition = every({
  predicate: (value) => value !== null,
  stores: [$selectedSubject, $selectedClass],
})

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

sample({
  source: $form,
  clock: checkIfThemeCanBeSend,
  fn: (obj) => {
    if (
      obj.name.trim().length &&
      obj.study_year_id !== DEFAULT_ID &&
      obj.subject_id !== DEFAULT_ID &&
      obj.theme_id !== DEFAULT_ID
    )
      updateLabel(obj)
    else {
      if (!obj.name.trim().length) titleErrorChanged(true)
      if (obj.study_year_id === DEFAULT_ID) classErrorChanged(true)
      if (obj.subject_id === DEFAULT_ID) subjectErrorChanged(true)
      if (obj.theme_id === DEFAULT_ID) themeErrorChanged(true)
      addToast({ type: 'error', message: 'Необходимо заполнить все обязательные поля' })
    }
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

forward({
  from: loadModalToEdit,
  to: [getLabelFx, modalVisibilityChanged.prepend(() => true)],
})

sample({
  clock: getLabelFx.doneData.map((data) => data.body),
  fn: (label: Label) => {
    $form.map((data) => (data.id = label.id))
    labelTitleChanged(label.name)
    label.subject && subjectDropdownModule.methods.itemChanged(`${label.subject.id}`)
    label.subject &&
      setSelectedSubject({
        id: label.subject.id,
        name: `${label.subject.id}`,
        title: label.subject.name,
      })
    label.study_year && classDropdownModule.methods.itemChanged(`${label.study_year.id}`)
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
    addToast.prepend(() => ({ type: 'success', message: 'Метка была успешно обновлена!' })),
    getLabelsTree.prepend(() => ({})),
    modalVisibilityChanged.prepend(() => false),
  ],
})

const { noInternetConnection } = split(
  merge([getLabelsTreeFx.failData, getLabelFx.failData, updateLabelFx.failData]),
  { noInternetConnection: ({ status }) => status === undefined }
)

forward({
  from: noInternetConnection,
  to: addToast.prepend(() => ({ type: 'no-internet', message: 'Отсутствует подключение' })),
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
    setSelectedTheme.prepend(() => null),
    setSelectedClass.prepend(() => null),
    setSelectedSubject.prepend(() => null),
  ],
})
