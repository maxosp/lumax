import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
import { condition, debounce, every } from 'patronum'
import {
  $selectedSubject,
  setSelectedSubject,
  subjectDropdownModule,
} from '@/pages/dictionary/themes/edit/parts/subjects/subjects.model'
import { errorToastEvent, successToastEvent } from '@/features/toasts/toasts.model'
import {
  $selectedThemes,
  themeDropdownModule,
} from '@/pages/dictionary/themes/edit/parts/themes/themes.model'
import {
  $selectedClass,
  classDropdownModule,
  setSelectedClass,
} from '@/pages/dictionary/themes/edit/parts/class/class.model'
import { positionDropdownModule } from '@/pages/dictionary/themes/edit/parts/position/position.model'
import {
  $selectedPrerequisites,
  prerequisiteDropdownModule,
  resetSelectedPrerequisites,
  setSelectedPrerequisites,
} from '@/pages/dictionary/themes/edit/parts/prerequisites/prerequisites.model'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'
import { CreateThemeType, Theme } from '@/features/api/subject/types'
import { navigatePush } from '@/features/navigation'
import { updateThemeFx } from '@/features/api/subject/update-theme'
import { getThemeFx } from '@/features/api/subject/get-theme'
import { DEFAULT_ID } from '@/pages/common/constants'
import { getThemesListFx } from '@/features/api/subject/get-themes-list'
import { createError } from '@/lib/effector/error-generator'

const getThemesTreeList = attach({
  effect: getThemesTreeListFx,
})

const updateThemeDataFx = attach({
  effect: updateThemeFx,
  mapParams: (params: CreateThemeType) => params,
})
const updatePrerequisiteFx = attach({
  effect: updateThemeFx,
  mapParams: (params: Partial<CreateThemeType>) => params,
})

export const getThemeToUpdate = attach({
  effect: getThemeFx,
})

const updateTheme = createEvent<void>()
const updatePrerequisite = createEvent<void>()

export const clearFields = createEvent<void>()

export const edit = createEvent<void>()
const checkIfThemeCanBeSend = createEvent<void>()
const checkIfPrerequisiteCanBeSend = createEvent<void>()

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

export const isPrerequisiteChanged = createEvent<boolean>()
export const $isPrerequisite = restore(isPrerequisiteChanged, false)

forward({
  from: clearFields,
  to: [
    resetThemeTitle,
    resetPrerequisiteTitle,
    classDropdownModule.methods.resetDropdown,
    subjectDropdownModule.methods.resetDropdown,
    positionDropdownModule.methods.resetDropdown,
    prerequisiteDropdownModule.methods.resetDropdown,
    themeDropdownModule.methods.resetDropdown,
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

sample({
  clock: getThemeToUpdate.done,
  source: getThemeFx.doneData.map((data) => data.body),
  fn: (theme: Theme) => {
    isPrerequisiteChanged(theme.is_prerequisite)
    themeTitleChanged(theme.name)
    prerequisiteTitleChanged(theme.name)
    classDropdownModule.methods.itemChanged(`${theme.study_year ? theme.study_year.number : null}`)
    theme.study_year &&
      setSelectedClass({
        id: theme.study_year.id,
        name: `${theme.study_year.id}`,
        title: theme.study_year.name,
      })
    subjectDropdownModule.methods.itemChanged(`${theme.subject.id}`)
    theme.subject &&
      setSelectedSubject({
        id: theme.subject.id,
        name: `${theme.subject.id}`,
        title: theme.subject.name,
      })
    const prerequisites = theme.prerequisites.map((el) => ({ name: `${el.id}`, title: el.name }))
    setSelectedPrerequisites(prerequisites)
    const themes = theme.themes.map((el) => ({ name: `${el.id}`, title: el.name, id: el.id }))
    themeDropdownModule.methods.setItems(themes)
    themes.forEach((el) => {
      themeDropdownModule.methods.itemChanged(el.name)
    })
    theme.parent_theme && positionDropdownModule.methods.itemChanged(`${theme.parent_theme.id}`)
    $formToSend.map((el) => (el.id = theme.id))
    $formToSendPrerequisite.map((el) => (el.id = theme.id))
  },
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
  from: [classDropdownModule.methods.itemChanged, subjectDropdownModule.methods.itemChanged],
  to: [positionDropdownModule.methods.resetItem.prepend(() => ({})), resetSelectedPrerequisites],
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
  clock: edit,
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
      updateTheme()
    else {
      if (!obj.name.trim().length) $themeTitleErrorModule.methods.setError(true)
      if (obj.study_year_id === DEFAULT_ID) $classErrorModule.methods.setError(true)
      if (obj.subject_id === DEFAULT_ID) $subjectErrorModule.methods.setError(true)
      errorToastEvent('Необходимо заполнить все обязательные поля')
    }
  },
})

sample({
  clock: updateTheme,
  source: $formToSend,
  target: updateThemeDataFx,
})

sample({
  source: $formToSendPrerequisite,
  clock: updatePrerequisite,
  target: updatePrerequisiteFx,
})

const $ifRedirect = sample({
  clock: [updateThemeDataFx, updatePrerequisiteFx],
  source: $redirectAfterSave,
  fn: (isRedirect: boolean) => isRedirect,
})

sample({
  source: $ifRedirect,
  clock: updateThemeDataFx.doneData.map((data) => data.body.id),
  fn: (ifRedirect: boolean, id: number) => {
    successToastEvent('Тема успешно обновлена!')
    if (ifRedirect) navigatePush({ name: 'themes-list' })
    else getThemeToUpdate(id)
  },
})
sample({
  source: $ifRedirect,
  clock: updatePrerequisiteFx.doneData.map((data) => data.body.id),
  fn: (ifRedirect: boolean, id: number) => {
    successToastEvent('Пререквизит успешно обновлен!')
    if (ifRedirect) navigatePush({ name: 'themes-list' })
    else getThemeToUpdate(id)
  },
})

sample({
  source: $formToSendPrerequisite,
  clock: checkIfPrerequisiteCanBeSend,
  fn: (obj) => {
    if (obj.name.length && obj.subject_id !== DEFAULT_ID) updatePrerequisite()
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
