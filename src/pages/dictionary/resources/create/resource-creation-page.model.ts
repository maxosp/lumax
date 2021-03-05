import { attach, combine, createEvent, forward, restore, sample, split } from 'effector-root'
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
import {
  $selectedTheme,
  themeDropdownModule,
} from '@/pages/dictionary/resources/create/parts/theme/theme.model'
import {
  $selectedType,
  setSelectedType,
  typeDropdownModule,
} from '@/pages/dictionary/resources/create/parts/type/type-dropdown.model'
import { DEFAULT_ID } from '@/pages/dictionary/resources/constants'
import {
  $fileData,
  uploadFileFx,
} from '@/pages/dictionary/resources/create/parts/file-upload/file-upload.model'
import { isLinkValid } from '@/lib/validators/url'
import { createResourceFx } from '@/features/api/media/create-resource'
import { CreateResourceType } from '@/features/api/media/types'
import { addToast } from '@/features/toasts/toasts.model'
import { navigatePush } from '@/features/navigation'

const getThemesTreeList = attach({
  effect: getThemesTreeListFx,
  mapParams: (params: GetListQueryParams) => params,
})

const createResource = attach({
  effect: createResourceFx,
  mapParams: (params: CreateResourceType) => params,
})

export const clearFields = createEvent<void>()

export const create = createEvent<void>()
const checkIfResourceCanBeSend = createEvent<void>()

export const resourceDescriptionChanged = createEvent<string>()
export const $resourceDescription = restore(resourceDescriptionChanged, '').reset(clearFields)

export const linkChanged = createEvent<string>()
export const resetLink = createEvent<void>()
export const $link = restore(linkChanged, '').reset(resetLink)

const saveResource = createEvent<void>()
export const redirectAfterSaveChanged = createEvent<boolean>()
const $redirectAfterSave = restore(redirectAfterSaveChanged, false)

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

// link: string ; theme_id: number ; text: string; media_id: number
export const $formToSend = combine({
  id: DEFAULT_ID,
  text: $resourceDescription,
  link: $link,
  theme_id: $selectedTheme.map((data) => (data ? +data.name : DEFAULT_ID)),
  media_id: $fileData.map((data) => (data ? data.id : undefined)),
  resource_type: $selectedType.map((data) => (data ? data.name : '')),
})

const setTypeError = createEvent<boolean>()
const resetTypeError = createEvent<void>()
export const $typeError = restore(setTypeError, false).reset(resetTypeError)

const setThemeError = createEvent<boolean>()
const resetThemeError = createEvent<void>()
export const $themeError = restore(setThemeError, false).reset(resetThemeError)

const setDescriptionError = createEvent<boolean>()
const resetDescriptionError = createEvent<void>()
export const $descriptionError = restore(setDescriptionError, false).reset(resetDescriptionError)

const setlinkError = createEvent<boolean>()
const resetlinkError = createEvent<void>()
export const $linkError = restore(setlinkError, false).reset(resetlinkError)

const setFileError = createEvent<boolean>()
const resetFileError = createEvent<void>()
export const $fileError = restore(setFileError, false).reset(resetFileError)

const resetErrors = createEvent<void>()

forward({
  from: resetErrors,
  to: [resetTypeError, resetThemeError, resetDescriptionError, resetLink, resetFileError],
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

forward({
  from: create,
  to: checkIfResourceCanBeSend,
})

sample({
  source: $formToSend,
  clock: checkIfResourceCanBeSend,
  fn: (obj) => {
    console.log(obj)
    let errors = 0
    if (!obj.resource_type) {
      setTypeError(true)
      errors += 1
    }
    if (!obj.theme_id) {
      setThemeError(true)
      errors += 1
    }
    if (obj.resource_type === 'text' && !obj.text.trim().length) {
      setDescriptionError(true)
      errors += 1
    } else if (
      (obj.resource_type === 'link' || obj.resource_type === 'video') &&
      (!obj.link.trim().length || !isLinkValid(obj.link))
    ) {
      setlinkError(true)
      errors += 1
    } else if (obj.resource_type === 'file' && !obj.media_id) {
      setFileError(true)
      errors += 1
    }
    if (errors === 0) saveResource()
    else if (errors > 0)
      addToast({ type: 'error', message: 'Необходимо заполнить все обязательные поля' })
  },
})

sample({
  clock: saveResource,
  source: $formToSend,
  target: createResource,
})

const { noInternetConnection } = split(createResourceFx.failData, {
  noInternetConnection: ({ status }) => status === undefined,
})

forward({
  from: noInternetConnection,
  to: addToast.prepend(() => ({ type: 'no-internet', message: 'Отсутствует подключение' })),
})

const $ifRedirect = sample({
  clock: createResource,
  source: $redirectAfterSave,
  fn: (isRedirect: boolean) => isRedirect,
})

sample({
  source: $ifRedirect,
  clock: createResourceFx.doneData.map((data) => data.body.id),
  fn: (ifRedirect: boolean, id: number) => {
    addToast({ type: 'success', message: 'Обучающий ресурс успешно создан!' })
    if (ifRedirect) navigatePush({ name: 'resources-list' })
    else navigatePush({ name: 'themes-edit', params: { id: `${id}` } })
  },
})

forward({
  from: setSelectedType,
  to: resetErrors,
})
forward({
  from: typeDropdownModule.methods.itemChanged,
  to: setTypeError.prepend(() => false),
})

forward({
  from: themeDropdownModule.methods.itemChanged,
  to: setThemeError.prepend(() => false),
})

forward({
  from: resourceDescriptionChanged,
  to: setDescriptionError.prepend(() => false),
})

forward({
  from: linkChanged,
  to: setlinkError.prepend(() => false),
})

forward({
  from: uploadFileFx,
  to: setFileError.prepend(() => false),
})
