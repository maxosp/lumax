import { attach, combine, createEvent, forward, merge, restore, sample, split } from 'effector-root'
import { condition, every } from 'patronum'
import { subjectDropdownModule } from '@/pages/theme-creation/parts/subjects/subjects.model'
import { addToast } from '@/features/toasts/toasts.model'
import {
  $selectedThemes,
  resetSelectedThemes,
  themeDropdownModule,
} from '@/pages/theme-creation/parts/themes/themes.model'
import { classDropdownModule } from '@/pages/theme-creation/parts/class/class.model'
import { positionDropdownModule } from '@/pages/theme-creation/parts/position/position.model'
import {
  $selectedPrerequisites,
  prerequisiteDropdownModule,
  resetSelectedPrerequisites,
} from '@/pages/theme-creation/parts/prerequisites/prerequisites.model'
import { getThemesListFx } from '@/features/api/subject/get-themes-list'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'
import { GetListQueryParams } from '@/features/api/types'
import { createThemeFx } from '@/features/api/subject/create-theme'
import { CreateThemeType, Theme } from '@/features/api/subject/types'
import { navigatePush } from '@/features/navigation'
import { updateThemeFx } from '@/features/api/subject/update-theme'
import { getThemeFx } from '@/features/api/subject/get-theme'
import { DEFAULT_ID } from '@/pages/theme-creation/constants'

const getThemesList = attach({
  effect: getThemesListFx,
  mapParams: (params: GetListQueryParams) => params,
})

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

const updateThemeDataFx = attach({
  effect: updateThemeFx,
  mapParams: (params: CreateThemeType) => params,
})

const updatePrerequisiteFx = attach({
  effect: updateThemeFx,
  mapParams: (params: Partial<CreateThemeType>) => params,
})

const getThemeToUpdate = attach({
  effect: getThemeFx,
  mapParams: (params: number) => params,
})

export const pareparePageForEditing = createEvent<number>()
const updateTheme = createEvent<void>()
const updatePrerequisite = createEvent<void>()

export const isEditingThemeChanged = createEvent<boolean>()
export const $isEditingTheme = restore<boolean>(isEditingThemeChanged, false)

export const clearFields = createEvent<void>()

export const save = createEvent<void>()
const checkIfThemeCanBeSend = createEvent<void>()
const checkIfPrerequisiteCanBeSend = createEvent<void>()
const saveTheme = createEvent<void>()
const savePrerequisite = createEvent<void>()
export const redirectAfterSaveChanged = createEvent<boolean>()
const $redirectAfterSave = restore(redirectAfterSaveChanged, false)

export const isPrerequisiteChanged = createEvent<boolean>()
export const $isPrerequisite = restore(isPrerequisiteChanged, false)
export const toggleIsPrerequisite = createEvent<boolean>()

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
    isEditingThemeChanged.prepend(() => false),
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

export const $canSetPrerequisites = every({
  predicate: (value) => value !== null,
  stores: [
    subjectDropdownModule.store.$item,
    classDropdownModule.store.$item,
    positionDropdownModule.store.$item,
  ],
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
  themes_ids: $selectedThemes.map((arr) => arr.map((data) => +data.name)),
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

forward({
  from: pareparePageForEditing,
  to: [isEditingThemeChanged.prepend(() => true), getThemeToUpdate],
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
    prerequisiteDropdownModule.methods.setItems(prerequisites)
    prerequisites.forEach((el) => prerequisiteDropdownModule.methods.itemChanged(el.name))
    const themes = theme.themes.map((el) => ({ name: `${el.id}`, title: el.name }))
    themeDropdownModule.methods.setItems(themes)
    themes.forEach((el) => themeDropdownModule.methods.itemChanged(el.name))
    theme.parent_theme && positionDropdownModule.methods.itemChanged(`${theme.parent_theme.id}`)
    $formToSend.map((el) => (el.id = theme.id))
    $formToSendPrerequisite.map((el) => (el.id = theme.id))
  },
})

const setThemeTitleError = createEvent<boolean>()
export const $themeTitleError = restore(setThemeTitleError, false)

const setPrerequisiteTitleError = createEvent<boolean>()
export const $prerequisiteTitleError = restore(setPrerequisiteTitleError, false)

const setClassError = createEvent<boolean>()
export const $classError = restore(setClassError, false)

const setPositionError = createEvent<boolean>()
export const $positionError = restore(setPositionError, false)

const setSubjectError = createEvent<boolean>()
export const $subjectError = restore(setSubjectError, false)

const $canToggleIsPrerequisite = sample({
  source: $selectedThemes,
  clock: toggleIsPrerequisite,
  fn: (list, isPrerequisite) => {
    return { listLength: list.length, value: isPrerequisite }
  },
})

condition({
  source: $canToggleIsPrerequisite,
  if: (payload: { listLength: number; value: boolean }) => payload.listLength > 0 && !payload.value,
  then: addToast.prepend(() => ({
    type: 'error',
    message: 'Удалите темы, к которым привязан пререквизит и повторите попытку',
  })),
  else: isPrerequisiteChanged.prepend(
    (payload: { listLength: number; value: boolean }) => payload.value
  ),
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
    resetSelectedPrerequisites,
    resetSelectedThemes,
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

forward({
  from: canGetThemesList,
  to: [
    getThemesList.prepend((data) => {
      if (data.study_year > 0)
        return {
          study_year: data.study_year,
          subject: data.subject,
        }
      return {
        subject: data.subject,
      }
    }),
    getThemesTreeList.prepend((data) => {
      if (data.study_year > 0)
        return {
          study_year: data.study_year,
          subject: data.subject,
        }
      return {
        subject: data.subject,
      }
    }),
  ],
})

getThemesTreeListFx.doneData.watch((data: any) => console.log(data))
const $saveMethodFired = sample({
  source: $isPrerequisite,
  clock: save,
  fn: (isPrerequisite) => isPrerequisite,
})

condition({
  source: $saveMethodFired,
  if: (isPrerequisite) => isPrerequisite,
  then: checkIfPrerequisiteCanBeSend.prepend(() => ({})),
  else: checkIfThemeCanBeSend.prepend(() => ({})),
})

sample({
  source: { $formToSend, $isEditingTheme },
  clock: checkIfThemeCanBeSend,
  fn: (obj) => {
    if (
      obj.$formToSend.name.trim().length &&
      obj.$formToSend.study_year_id &&
      obj.$formToSend.subject_id
    ) {
      obj.$isEditingTheme ? updateTheme() : saveTheme()
    } else {
      if (!obj.$formToSend.name.trim().length) setThemeTitleError(true)
      if (!obj.$formToSend.study_year_id) setClassError(true)
      if (!obj.$formToSend.subject_id) setSubjectError(true)
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

const { noInternetConnection } = split(
  merge([
    updateThemeDataFx.failData,
    updatePrerequisiteFx.failData,
    saveThemeFx.failData,
    savePrerequisiteFx.failData,
  ]),
  { noInternetConnection: ({ status }) => status === undefined }
)

forward({
  from: noInternetConnection,
  to: addToast.prepend(() => ({ type: 'no-internet', message: 'Отсутствует подключение' })),
})

forward({
  from: updateThemeDataFx.doneData,
  to: addToast.prepend(() => ({ type: 'success', message: 'Тема успешно обновлена!' })),
})
forward({
  from: updatePrerequisiteFx.doneData,
  to: addToast.prepend(() => ({ type: 'success', message: 'Пререквизит успешно обновлен!' })),
})

const $ifRedirect = sample({
  clock: [
    updateThemeDataFx.done,
    saveThemeFx.done,
    updatePrerequisiteFx.done,
    savePrerequisiteFx.done,
  ],
  source: $redirectAfterSave,
  fn: (isRedirect: boolean) => isRedirect,
})

condition({
  source: $ifRedirect,
  if: (payload) => payload,
  then: navigatePush.prepend(() => ({ name: 'themes' })),
})

forward({
  from: saveThemeFx.doneData.map((data) => data.body.id),
  to: [
    addToast.prepend(() => ({ type: 'success', message: 'Тема успешно создана!' })),
    isEditingThemeChanged.prepend(() => true),
    pareparePageForEditing,
  ],
})
forward({
  from: savePrerequisiteFx.doneData.map((data) => data.body.id),
  to: [
    addToast.prepend(() => ({ type: 'success', message: 'Пререквизит успешно создан!' })),
    isEditingThemeChanged.prepend(() => true),
    pareparePageForEditing,
  ],
})

sample({
  source: $formToSendPrerequisite,
  clock: checkIfPrerequisiteCanBeSend,
  fn: (obj) => {
    if (obj.name.length && obj.subject_id !== null) {
      $isEditingTheme.map((data) => (data ? updatePrerequisite() : savePrerequisite()))
    } else {
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
