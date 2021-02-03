import { combine, createEvent, forward, restore, sample } from 'effector-root'
import { condition, every } from 'patronum'
import { $subject, subjectChanged } from '@/pages/theme-creation/parts/subjects/subjects.model'
import { addToast } from '@/features/toasts/toasts.model'
import { $selectedThemes } from '@/pages/theme-creation/parts/themes/themes.model'
import { $class, classChanged } from '@/pages/theme-creation/parts/class/class.model'
import { $position, positionChanged } from '@/pages/theme-creation/parts/position/position.model'
import {
  prerequisiteChanged,
  resetSelectedPrerequisites,
} from '@/pages/theme-creation/parts/prerequisites/prerequisites.model'

export const save = createEvent<void>()
const saveTheme = createEvent<void>()
const savePrerequisite = createEvent<void>()

export const isPrerequisiteChanged = createEvent<boolean>()
export const $isPrerequisite = restore(isPrerequisiteChanged, false)
export const toggleIsPrerequisite = createEvent<boolean>()

export const themeTitleChanged = createEvent<string>()
export const $themeTitle = restore(themeTitleChanged, '')

export const prerequisiteTitleChanged = createEvent<string>()
export const $prerequisiteTitle = restore(prerequisiteTitleChanged, '')

export const $canSetThemePosition = every({
  predicate: (value) => value !== null,
  stores: [$subject, $class],
})

const $themeForm = combine({
  title: $themeTitle,
  subject: $subject,
  class: $class,
  position: $position,
})
const $prerequisiteForm = combine({
  title: $prerequisiteTitle,
  subject: $subject,
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
  clock: toggleIsPrerequisite,
  source: $selectedThemes,
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
    themeTitleChanged.prepend(() => ''),
    classChanged.prepend(() => null),
    subjectChanged.prepend(() => null),
    positionChanged.prepend(() => null),
    prerequisiteChanged.prepend(() => null),
    resetSelectedPrerequisites,
  ],
})

const $saveMethodFired = sample({
  source: $isPrerequisite,
  clock: save,
  fn: (isPrerequisite) => isPrerequisite,
})

condition({
  source: $saveMethodFired,
  if: (isPrerequisite) => isPrerequisite,
  then: savePrerequisite.prepend(() => ({})),
  else: saveTheme.prepend(() => ({})),
})

sample({
  clock: saveTheme,
  source: $themeForm,
  fn: (obj) => {
    if (obj.title.length > 0 && obj.class !== null && obj.position !== null && obj.subject !== null)
      addToast({ type: 'success', message: 'Тема успешно создана!' })
    else {
      if (obj.title.length === 0) setThemeTitleError(true)
      if (obj.class === null) setClassError(true)
      if (obj.position === null) setPositionError(true)
      if (obj.subject === null) setSubjectError(true)
      addToast({ type: 'error', message: 'Необходимо заполнить все обязательные поля' })
    }
  },
})

sample({
  clock: savePrerequisite,
  source: $prerequisiteForm,
  fn: (obj) => {
    if (obj.title.length > 0 && obj.subject !== null)
      addToast({ type: 'success', message: 'Пререквизит успешно создан!' })
    else {
      if (obj.title.length === 0) setPrerequisiteTitleError(true)
      if (obj.subject === null) setSubjectError(true)
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
  from: classChanged,
  to: setClassError.prepend(() => false),
})

forward({
  from: positionChanged,
  to: setPositionError.prepend(() => false),
})

forward({
  from: subjectChanged,
  to: setSubjectError.prepend(() => false),
})
