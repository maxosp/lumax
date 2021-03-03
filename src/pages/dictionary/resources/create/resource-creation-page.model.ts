import { attach, combine, createEvent, forward, restore } from 'effector-root'
import { debounce, every } from 'patronum'
import {
  $selectedSubject,
  setSelectedSubject,
  subjectDropdownModule,
} from '@/pages/dictionary/resources/create/parts/subjects/subjects.model'
import {
  $selectedClass,
  classDropdownModule,
  setSelectedClass,
} from '@/pages/dictionary/resources/create/parts/class/class.model'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'
import { GetListQueryParams } from '@/features/api/types'

import { getThemesListFx } from '@/features/api/subject/get-themes-list'
import { themeDropdownModule } from './parts/theme/theme.model'
import { typeDropdownModule } from './parts/type/type-dropdown.model'

const getThemesTreeList = attach({
  effect: getThemesTreeListFx,
  mapParams: (params: GetListQueryParams) => params,
})

// const saveThemeFx = attach({
//   effect: createThemeFx,
//   mapParams: (params: CreateThemeType) => params,
// })

export const clearFields = createEvent<void>()

export const create = createEvent<void>()

export const resourceDescriptionChanged = createEvent<string>()
export const $resourceDescription = restore(resourceDescriptionChanged, '').reset(clearFields)

export const videoLinkChanged = createEvent<string>()
export const resetVideoLink = createEvent<void>()
export const $videoLink = restore(videoLinkChanged, '').reset(resetVideoLink)

// const checkIfThemeCanBeSend = createEvent<void>()
// const saveTheme = createEvent<void>()
export const redirectAfterSaveChanged = createEvent<boolean>()
// const $redirectAfterSave = restore(redirectAfterSaveChanged, false)

forward({
  from: clearFields,
  to: [
    classDropdownModule.methods.resetItem,
    classDropdownModule.methods.resetSearchString,
    subjectDropdownModule.methods.resetItem,
    subjectDropdownModule.methods.resetSearchString,
    themeDropdownModule.methods.resetItem,
    themeDropdownModule.methods.resetSearchString,
    typeDropdownModule.methods.resetItem,
    typeDropdownModule.methods.resetSearchString,
    setSelectedSubject.prepend(() => null),
    setSelectedClass.prepend(() => null),
  ],
})

export const $canSetTheme = every({
  predicate: (value) => value !== null,
  stores: [$selectedSubject, $selectedClass],
})

// export const $formToSend = combine({
//   id: DEFAULT_ID,
//   name: $themeTitle,
//   study_year_id: $selectedClass.map((data) => (data ? +data.name : DEFAULT_ID)),
//   subject_id: $selectedSubject.map((data) => (data ? +data.name : DEFAULT_ID)),
// })

const setTypeError = createEvent<boolean>()
const resetTypeError = createEvent<void>()
export const $typeError = restore(setTypeError, false).reset(resetTypeError)

const setClassError = createEvent<boolean>()
const resetClassError = createEvent<void>()
export const $classError = restore(setClassError, false).reset(resetClassError)

const setThemeError = createEvent<boolean>()
const resetThemeError = createEvent<void>()
export const $themeError = restore(setThemeError, false).reset(resetThemeError)

const setSubjectError = createEvent<boolean>()
const resetSubjectError = createEvent<void>()
export const $subjectError = restore(setSubjectError, false).reset(resetSubjectError)

const setVideoLinkError = createEvent<boolean>()
const resetVideoLinkError = createEvent<void>()
export const $videoLinkError = restore(setVideoLinkError, false).reset(resetVideoLinkError)

const resetErrors = createEvent<void>()

forward({
  from: resetErrors,
  to: [resetTypeError, resetClassError, resetThemeError, resetSubjectError],
})

forward({
  from: [classDropdownModule.methods.itemChanged, subjectDropdownModule.methods.itemChanged],
  to: themeDropdownModule.methods.resetItem.prepend(() => ({})),
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

// sample({
//   source: $formToSend,
//   clock: checkIfThemeCanBeSend,
//   fn: (obj) => {
//     if (obj.name.trim().length && obj.study_year_id && obj.subject_id) saveTheme()
//     else {
//       if (!obj.name.trim().length) setThemeTitleError(true)
//       if (!obj.study_year_id) setClassError(true)
//       if (!obj.subject_id) setSubjectError(true)
//       addToast({ type: 'error', message: 'Необходимо заполнить все обязательные поля' })
//     }
//   },
// })

// sample({
//   clock: saveTheme,
//   source: $formToSend,
//   target: saveThemeFx,
// })

// const { noInternetConnection } = split(merge([saveThemeFx.failData, savePrerequisiteFx.failData]), {
//   noInternetConnection: ({ status }) => status === undefined,
// })

// forward({
//   from: noInternetConnection,
//   to: addToast.prepend(() => ({ type: 'no-internet', message: 'Отсутствует подключение' })),
// })

// const $ifRedirect = sample({
//   clock: [saveThemeFx],
//   source: $redirectAfterSave,
//   fn: (isRedirect: boolean) => isRedirect,
// })

// sample({
//   source: $ifRedirect,
//   clock: saveThemeFx.doneData.map((data) => data.body.id),
//   fn: (ifRedirect: boolean, id: number) => {
//     addToast({ type: 'success', message: 'Тема успешно создана!' })
//     if (ifRedirect) navigatePush({ name: 'themes-list' })
//     else navigatePush({ name: 'themes-edit', params: { id: `${id}` } })
//   },
// })

forward({
  from: typeDropdownModule.methods.itemChanged,
  to: setTypeError.prepend(() => false),
})

forward({
  from: classDropdownModule.methods.itemChanged,
  to: setClassError.prepend(() => false),
})

forward({
  from: themeDropdownModule.methods.itemChanged,
  to: setThemeError.prepend(() => false),
})

forward({
  from: subjectDropdownModule.methods.itemChanged,
  to: setSubjectError.prepend(() => false),
})
