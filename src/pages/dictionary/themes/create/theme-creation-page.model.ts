import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
import { condition } from 'patronum'
import {
  $selectedSubject,
  setSelectedSubject,
  subjectDropdownModule,
} from '@/pages/dictionary/themes/create/parts/subjects/subjects.model'
import { errorToastEvent, successToastEvent } from '@/features/toasts/toasts.model'
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
  prerequisitesDropdownModel,
  resetSelectedPrerequisites,
} from '@/pages/dictionary/themes/create/parts/prerequisites/prerequisites.model'
import { createThemeFx } from '@/features/api/subject/create-theme'
import { CreateThemeType } from '@/features/api/subject/types'
import { navigatePush } from '@/features/navigation'
import { DEFAULT_ID } from '@/pages/common/constants'
import {
  $isPrerequisite,
  isPrerequisiteChanged,
} from '@/pages/dictionary/themes/create/parts/header/header.model'
import { createError } from '@/lib/effector/error-generator'

const saveThemeFx = attach({
  effect: createThemeFx,
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
    classDropdownModule.methods.resetDropdown,
    subjectDropdownModule.methods.resetDropdown,
    positionDropdownModule.methods.resetDropdown,
    prerequisitesDropdownModel.methods.resetDropdown,
    themeDropdownModule.methods.resetDropdown,
    setSelectedSubject.prepend(() => null),
    setSelectedClass.prepend(() => null),
  ],
})

export const $formToSend = combine({
  id: DEFAULT_ID,
  name: $themeTitle,
  is_prerequisite: $isPrerequisite,
  study_year_id: $selectedClass.map((data) => (data && data.id ? +data.id : DEFAULT_ID)),
  subject_id: $selectedSubject.map((data) => (data && data.id ? +data.id : DEFAULT_ID)),
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
  subject_id: $selectedSubject.map((data) => (data && data.id ? +data.id : DEFAULT_ID)),
  themes_ids: $selectedThemes.map((arr) => arr.map((data) => +data.name)),
})
export const $themeTitleErrorModule = createError()

export const $prerequisiteTitleErrorModule = createError()

export const $classErrorModule = createError()

export const $positionErrorModule = createError()

export const $subjectErrorModule = createError()

const resetErrors = createEvent<void>()

forward({
  from: resetErrors,
  to: [
    $themeTitleErrorModule.methods.resetError,
    $prerequisiteTitleErrorModule.methods.resetError,
    $classErrorModule.methods.resetError,
    $positionErrorModule.methods.resetError,
    $subjectErrorModule.methods.resetError,
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
    prerequisitesDropdownModel.methods.resetItem,
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
  to: [resetSelectedPrerequisites, prerequisitesDropdownModel.methods.resetItem],
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
    if (obj.name.trim().length && obj.study_year_id !== DEFAULT_ID && obj.subject_id !== DEFAULT_ID)
      saveTheme()
    else {
      if (!obj.name.trim().length) $themeTitleErrorModule.methods.setError(true)
      if (obj.study_year_id === DEFAULT_ID) $classErrorModule.methods.setError(true)
      if (obj.subject_id === DEFAULT_ID) $subjectErrorModule.methods.setError(true)
      errorToastEvent('Необходимо заполнить все обязательные поля')
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

const $ifRedirect = sample({
  clock: [saveThemeFx, savePrerequisiteFx],
  source: $redirectAfterSave,
  fn: (isRedirect: boolean) => isRedirect,
})

sample({
  source: $ifRedirect,
  clock: saveThemeFx.doneData.map((data) => data.body.id),
  fn: (ifRedirect: boolean, id: number) => {
    successToastEvent('Тема успешно создана!')
    if (ifRedirect) navigatePush({ name: 'themes-list' })
    else navigatePush({ name: 'themes-edit', params: { id: `${id}` } })
  },
})
sample({
  source: $ifRedirect,
  clock: savePrerequisiteFx.doneData.map((data) => data.body.id),
  fn: (ifRedirect: boolean, id: number) => {
    successToastEvent('Пререквизит успешно создан!')
    if (ifRedirect) navigatePush({ name: 'themes-list' })
    else navigatePush({ name: 'themes-edit', params: { id: `${id}` } })
  },
})

sample({
  source: $formToSendPrerequisite,
  clock: checkIfPrerequisiteCanBeSend,
  fn: (obj) => {
    if (obj.name.length && obj.subject_id !== DEFAULT_ID) savePrerequisite()
    else {
      if (obj.name.length === 0) $prerequisiteTitleErrorModule.methods.setError(true)
      if (obj.subject_id === DEFAULT_ID) $subjectErrorModule.methods.setError(true)
      errorToastEvent('Необходимо заполнить все обязательные поля')
    }
  },
})

forward({
  from: themeTitleChanged,
  to: $themeTitleErrorModule.methods.resetError,
})

forward({
  from: prerequisiteTitleChanged,
  to: $prerequisiteTitleErrorModule.methods.resetError,
})

forward({
  from: classDropdownModule.methods.itemChanged,
  to: $classErrorModule.methods.resetError,
})

forward({
  from: positionDropdownModule.methods.itemChanged,
  to: $positionErrorModule.methods.resetError,
})

forward({
  from: subjectDropdownModule.methods.itemChanged,
  to: $subjectErrorModule.methods.resetError,
})
