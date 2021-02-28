import { attach, combine, createEvent, forward, merge, restore, sample, split } from 'effector-root'
import { condition, debounce, every } from 'patronum'
import { subjectDropdownModule } from '@/pages/theme-edition/parts/subjects/subjects.model'
import { addToast } from '@/features/toasts/toasts.model'
import {
  $selectedThemes,
  themeDropdownModule,
} from '@/pages/theme-edition/parts/themes/themes.model'
import { classDropdownModule } from '@/pages/theme-edition/parts/class/class.model'
import { positionDropdownModule } from '@/pages/theme-edition/parts/position/position.model'
import {
  $selectedPrerequisites,
  prerequisiteDropdownModule,
  resetSelectedPrerequisites,
  setSelectedPrerequisites,
} from '@/pages/theme-edition/parts/prerequisites/prerequisites.model'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'
import { GetListQueryParams } from '@/features/api/types'
import { CreateThemeType, Theme } from '@/features/api/subject/types'
import { navigatePush } from '@/features/navigation'
import { updateThemeFx } from '@/features/api/subject/update-theme'
import { getThemeFx } from '@/features/api/subject/get-theme'
import { DEFAULT_ID } from '@/pages/theme-creation/constants'
import { getThemesListFx } from '@/features/api/subject/get-themes-list'

const getThemesTreeList = attach({
  effect: getThemesTreeListFx,
  mapParams: (params: GetListQueryParams) => params,
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
  mapParams: (params: number) => params,
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
  ],
})

export const $canSetThemePosition = every({
  predicate: (value) => value !== null,
  stores: [subjectDropdownModule.store.$item, classDropdownModule.store.$item],
})

export const $formToSend = combine({
  id: DEFAULT_ID,
  name: $themeTitle,
  is_prerequisite: $isPrerequisite,
  study_year_id: combine(
    {
      list: classDropdownModule.store.$itemsDropdown,
      elem: classDropdownModule.store.$item,
    },
    ({ list, elem }) => list.find((item) => item.name === elem)?.id!
  ),
  subject_id: combine(
    {
      list: subjectDropdownModule.store.$itemsDropdown,
      elem: subjectDropdownModule.store.$item,
    },
    ({ list, elem }) => +list.find((item) => item.name === elem)?.name!
  ),
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
  subject_id: combine(
    {
      list: subjectDropdownModule.store.$itemsDropdown,
      elem: subjectDropdownModule.store.$item,
    },
    ({ list, elem }) => +list.find((item) => item.name === elem)?.name!
  ),
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
    subjectDropdownModule.methods.itemChanged(`${theme.subject.id}`)
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
  from: [classDropdownModule.methods.itemChanged, subjectDropdownModule.methods.itemChanged],
  to: [positionDropdownModule.methods.resetItem.prepend(() => ({})), resetSelectedPrerequisites],
})

const canGetThemesList = combine(
  classDropdownModule.store.$item,
  subjectDropdownModule.store.$item,
  (cl, obj) => ({ study_year: +cl!, subject: +obj! })
)

const debounced = debounce({
  source: canGetThemesList,
  timeout: 150,
})

forward({
  from: debounced,
  to: [
    getThemesTreeList.prepend((data) => {
      if (data.study_year > 0)
        return {
          study_year: data.study_year,
          subject: data.subject,
          is_prerequisite: false,
        }
      return {
        subject: data.subject,
        is_prerequisite: false,
      }
    }),
    getThemesListFx.prepend((data) => ({ subject: data.subject })),
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
    if (obj.name.trim().length && obj.study_year_id && obj.subject_id) updateTheme()
    else {
      if (!obj.name.trim().length) setThemeTitleError(true)
      if (!obj.study_year_id) setClassError(true)
      if (!obj.subject_id) setSubjectError(true)
      addToast({ type: 'error', message: 'Необходимо заполнить все обязательные поля' })
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

const { noInternetConnection } = split(
  merge([updateThemeDataFx.failData, updatePrerequisiteFx.failData]),
  { noInternetConnection: ({ status }) => status === undefined }
)

forward({
  from: noInternetConnection,
  to: addToast.prepend(() => ({ type: 'no-internet', message: 'Отсутствует подключение' })),
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
    addToast({ type: 'success', message: 'Тема успешно обновлена!' })
    if (ifRedirect) navigatePush({ name: 'themes' })
    else getThemeToUpdate(id)
  },
})
sample({
  source: $ifRedirect,
  clock: updatePrerequisiteFx.doneData.map((data) => data.body.id),
  fn: (ifRedirect: boolean, id: number) => {
    addToast({ type: 'success', message: 'Пререквизит успешно обновлен!' })
    if (ifRedirect) navigatePush({ name: 'themes' })
    else getThemeToUpdate(id)
  },
})

sample({
  source: $formToSendPrerequisite,
  clock: checkIfPrerequisiteCanBeSend,
  fn: (obj) => {
    if (obj.name.length && obj.subject_id !== null) updatePrerequisite()
    else {
      if (obj.name.length === 0) setPrerequisiteTitleError(true)
      if (obj.subject_id === null) setSubjectError(true)
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
