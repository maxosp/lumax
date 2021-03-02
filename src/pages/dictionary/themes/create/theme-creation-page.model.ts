import { attach, combine, createEvent, forward, merge, restore, sample, split } from 'effector-root'
import { condition, debounce, every } from 'patronum'
import {
  $selectedSubject,
  setSelectedSubject,
  subjectDropdownModule,
} from '@/pages/dictionary/themes/create/parts/subjects/subjects.model'
import { addToast } from '@/features/toasts/toasts.model'
import {
  $selectedThemes,
  resetSelectedThemes,
  themeDropdownModule,
} from '@/pages/dictionary/themes/create/parts/themes/themes.model'
import {
  $selectedClass,
  classDropdownModule,
  setSelectedClass,
} from '@/pages/dictionary/themes/create/parts/class/class.model'
import { positionDropdownModule } from '@/pages/dictionary/themes/create/parts/position/position.model'
import {
  $selectedPrerequisites,
  prerequisiteDropdownModule,
  resetSelectedPrerequisites,
} from '@/pages/dictionary/themes/create/parts/prerequisites/prerequisites.model'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'
import { GetListQueryParams } from '@/features/api/types'
import { createThemeFx } from '@/features/api/subject/create-theme'
import { CreateThemeType } from '@/features/api/subject/types'
import { navigatePush } from '@/features/navigation'
import { DEFAULT_ID } from '@/pages/dictionary/themes/create/constants'
import {
  $isPrerequisite,
  isPrerequisiteChanged,
} from '@/pages/dictionary/themes/create/parts/header/header.model'
import { getThemesListFx } from '@/features/api/subject/get-themes-list'

const getThemesTreeList = attach({
  effect: getThemesTreeListFx,
  mapParams: (params: GetListQueryParams) => params,
})

const saveThemeFx = attach({
  effect: createThemeFx,
  mapParams: (params: CreateThemeType) => params,
})

const savePrerequisiteFx = attach({
  effect: createThemeFx,
  mapParams: (params: Partial<CreateThemeType>) => params,
})

export const clearFields = createEvent<void>()

export const create = createEvent<void>()
const checkIfThemeCanBeSend = createEvent<void>()
const checkIfPrerequisiteCanBeSend = createEvent<void>()
const saveTheme = createEvent<void>()
const savePrerequisite = createEvent<void>()
export const redirectAfterSaveChanged = createEvent<boolean>()
const $redirectAfterSave = restore(redirectAfterSaveChanged, false)

export const resetThemeTitle = createEvent<void>()
export const themeTitleChanged = createEvent<string>()
export const $themeTitle = restore(themeTitleChanged, '').reset(resetThemeTitle)

export const resetPrerequisiteTitle = createEvent<void>()
export const prerequisiteTitleChanged = createEvent<string>()
export const $prerequisiteTitle = restore(prerequisiteTitleChanged, '').reset(
  resetPrerequisiteTitle
)

forward({
  from: clearFields,
  to: [
    isPrerequisiteChanged.prepend(() => false),
    resetThemeTitle,
    resetPrerequisiteTitle,
    classDropdownModule.methods.resetItem,
    classDropdownModule.methods.resetSearchString,
    subjectDropdownModule.methods.resetItem,
    subjectDropdownModule.methods.resetSearchString,
    positionDropdownModule.methods.resetItem,
    positionDropdownModule.methods.resetSearchString,
    prerequisiteDropdownModule.methods.resetItem,
    prerequisiteDropdownModule.methods.resetSearchString,
    themeDropdownModule.methods.resetItem,
    themeDropdownModule.methods.resetSearchString,
    setSelectedSubject.prepend(() => null),
    setSelectedClass.prepend(() => null),
  ],
})

export const $canSetThemePosition = every({
  predicate: (value) => value !== null,
  stores: [$selectedSubject, $selectedClass],
})

export const $formToSend = combine({
  id: DEFAULT_ID,
  name: $themeTitle,
  is_prerequisite: $isPrerequisite,
  study_year_id: $selectedClass.map((data) => (data ? +data.name : DEFAULT_ID)),
  subject_id: $selectedSubject.map((data) => (data ? +data.name : DEFAULT_ID)),
  themes_ids: $selectedThemes.map((arr) => arr.map((data) => data && +data.name)),
  prerequisites_ids: $selectedPrerequisites.map((arr) => arr.map((data) => +data.name)),
  parent_theme_id: positionDropdownModule.store.$item.map((data) =>
    data !== null ? +data! : null
  ),
})

export const $formToSendPrerequisite = combine({
  id: DEFAULT_ID,
  name: $prerequisiteTitle,
  is_prerequisite: $isPrerequisite,
  subject_id: $selectedSubject.map((data) => (data ? +data.name : DEFAULT_ID)),
  themes_ids: $selectedThemes.map((arr) => arr.map((data) => +data.name)),
})

const setThemeTitleError = createEvent<boolean>()
const resetThemeTitleError = createEvent<void>()
export const $themeTitleError = restore(setThemeTitleError, false).reset(resetThemeTitleError)

const setPrerequisiteTitleError = createEvent<boolean>()
const resetPrerequisiteTitleError = createEvent<void>()
export const $prerequisiteTitleError = restore(setPrerequisiteTitleError, false).reset(
  resetPrerequisiteTitleError
)

const setClassError = createEvent<boolean>()
const resetClassError = createEvent<void>()
export const $classError = restore(setClassError, false).reset(resetClassError)

const setPositionError = createEvent<boolean>()
const resetPositionError = createEvent<void>()
export const $positionError = restore(setPositionError, false).reset(resetPositionError)

const setSubjectError = createEvent<boolean>()
const resetSubjectError = createEvent<void>()
export const $subjectError = restore(setSubjectError, false).reset(resetSubjectError)

const resetErrors = createEvent<void>()

forward({
  from: resetErrors,
  to: [
    resetThemeTitleError,
    resetPrerequisiteTitleError,
    resetClassError,
    resetPositionError,
    resetSubjectError,
  ],
})

forward({
  from: isPrerequisiteChanged,
  to: [
    resetThemeTitle,
    resetPrerequisiteTitle,
    classDropdownModule.methods.resetItem,
    subjectDropdownModule.methods.resetItem,
    positionDropdownModule.methods.resetItem,
    prerequisiteDropdownModule.methods.resetItem,
    themeDropdownModule.methods.resetItem,
    setSelectedSubject.prepend(() => null),
    setSelectedClass.prepend(() => null),
    resetSelectedPrerequisites,
    resetSelectedThemes,
    resetErrors,
  ],
})

forward({
  from: [classDropdownModule.methods.itemChanged, subjectDropdownModule.methods.itemChanged],
  to: positionDropdownModule.methods.resetItem.prepend(() => ({})),
})

forward({
  from: subjectDropdownModule.methods.itemChanged,
  to: [resetSelectedPrerequisites, prerequisiteDropdownModule.methods.resetItem],
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
    getThemesTreeList.prepend((data) => {
      return {
        study_year: data.study_year ? data.study_year : undefined,
        subject: data.subject ? data.subject : undefined,
        is_prerequisite: false,
      }
    }),
    getThemesListFx.prepend((data) => ({ subject: data.subject || undefined })),
  ],
})

const $saveMethodFired = sample({
  source: $isPrerequisite,
  clock: create,
  fn: (isPrerequisite) => isPrerequisite,
})

condition({
  source: $saveMethodFired,
  if: (isPrerequisite) => isPrerequisite,
  then: checkIfPrerequisiteCanBeSend.prepend(() => ({})),
  else: checkIfThemeCanBeSend.prepend(() => ({})),
})

sample({
  source: $formToSend,
  clock: checkIfThemeCanBeSend,
  fn: (obj) => {
    if (obj.name.trim().length && obj.study_year_id && obj.subject_id) saveTheme()
    else {
      if (!obj.name.trim().length) setThemeTitleError(true)
      if (!obj.study_year_id) setClassError(true)
      if (!obj.subject_id) setSubjectError(true)
      addToast({ type: 'error', message: 'Необходимо заполнить все обязательные поля' })
    }
  },
})

sample({
  clock: saveTheme,
  source: $formToSend,
  target: saveThemeFx,
})
sample({
  source: $formToSendPrerequisite,
  clock: savePrerequisite,
  target: savePrerequisiteFx,
})

const { noInternetConnection } = split(merge([saveThemeFx.failData, savePrerequisiteFx.failData]), {
  noInternetConnection: ({ status }) => status === undefined,
})

forward({
  from: noInternetConnection,
  to: addToast.prepend(() => ({ type: 'no-internet', message: 'Отсутствует подключение' })),
})

const $ifRedirect = sample({
  clock: [saveThemeFx, savePrerequisiteFx],
  source: $redirectAfterSave,
  fn: (isRedirect: boolean) => isRedirect,
})

sample({
  source: $ifRedirect,
  clock: saveThemeFx.doneData.map((data) => data.body.id),
  fn: (ifRedirect: boolean, id: number) => {
    addToast({ type: 'success', message: 'Тема успешно создана!' })
    if (ifRedirect) navigatePush({ name: 'themes-list' })
    else navigatePush({ name: 'themes-edit', params: { id: `${id}` } })
  },
})
sample({
  source: $ifRedirect,
  clock: savePrerequisiteFx.doneData.map((data) => data.body.id),
  fn: (ifRedirect: boolean, id: number) => {
    addToast({ type: 'success', message: 'Пререквизит успешно создан!' })
    if (ifRedirect) navigatePush({ name: 'themes-list' })
    else navigatePush({ name: 'themes-edit', params: { id: `${id}` } })
  },
})

sample({
  source: $formToSendPrerequisite,
  clock: checkIfPrerequisiteCanBeSend,
  fn: (obj) => {
    if (obj.name.length && obj.subject_id) savePrerequisite()
    else {
      if (obj.name.length === 0) setPrerequisiteTitleError(true)
      if (!obj.subject_id) setSubjectError(true)
      addToast({ type: 'error', message: 'Необходимо заполнить все обязательные поля' })
    }
  },
})

forward({
  from: themeTitleChanged,
  to: setThemeTitleError.prepend(() => false),
})

forward({
  from: prerequisiteTitleChanged,
  to: setPrerequisiteTitleError.prepend(() => false),
})

forward({
  from: classDropdownModule.methods.itemChanged,
  to: setClassError.prepend(() => false),
})

forward({
  from: positionDropdownModule.methods.itemChanged,
  to: setPositionError.prepend(() => false),
})

forward({
  from: subjectDropdownModule.methods.itemChanged,
  to: setSubjectError.prepend(() => false),
})
