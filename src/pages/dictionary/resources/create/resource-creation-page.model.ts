import { attach, combine, createEvent, forward, guard, restore, sample, split } from 'effector-root'
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
import { addToast } from '@/features/toasts/toasts.model'
import { navigatePush } from '@/features/navigation'
import { createError } from '@/lib/effector/error-generator'

const getThemesTreeList = attach({
  effect: getThemesTreeListFx,
})

const createResource = attach({
  effect: createResourceFx,
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

export const $formToSend = combine({
  id: DEFAULT_ID,
  text: $resourceDescription,
  link: $link,
  theme: $selectedTheme.map((data) => (data ? +data.name : DEFAULT_ID)),
  media_id: $fileData.map((data) => (data ? data.id : DEFAULT_ID)),
  resource_type: $selectedType.map((data) => (data ? data.name : '')),
})

export const $typeErrorModule = createError()

export const $themeErrorModule = createError()

export const $descriptionErrorModule = createError()

export const $linkErrorModule = createError()

export const $fileErrorModule = createError()

const resetErrors = createEvent<void>()

forward({
  from: resetErrors,
  to: [
    $typeErrorModule.methods.resetError,
    $themeErrorModule.methods.resetError,
    $descriptionErrorModule.methods.resetError,
    resetLink,
    $fileErrorModule.methods.resetError,
  ],
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
      $typeErrorModule.methods.setError(true)
      errors += 1
    }
    if (obj.theme === DEFAULT_ID) {
      $themeErrorModule.methods.setError(true)
      errors += 1
    }
    if (obj.resource_type === 'text' && !obj.text.trim().length) {
      $descriptionErrorModule.methods.setError(true)
      errors += 1
    } else if (
      (obj.resource_type === 'link' || obj.resource_type === 'video') &&
      (!obj.link.trim().length || !isLinkValid(obj.link))
    ) {
      $linkErrorModule.methods.setError(true)
      errors += 1
    } else if (obj.resource_type === 'file' && !obj.media_id) {
      $fileErrorModule.methods.setError(true)
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

const $ifRedirect = guard({
  clock: createResource,
  source: $redirectAfterSave,
  filter: (isRedirect: boolean) => isRedirect,
})

sample({
  source: $ifRedirect,
  clock: createResourceFx.doneData.map((data) => data.body.id),
  fn: (ifRedirect: boolean, id: number) => {
    addToast({ type: 'success', message: 'Обучающий ресурс успешно создан!' })
    if (ifRedirect) navigatePush({ name: 'resources-list' })
    else navigatePush({ name: 'resource-edit', params: { id: `${id}` } })
  },
})

forward({
  from: setSelectedType,
  to: resetErrors,
})
forward({
  from: typeDropdownModule.methods.itemChanged,
  to: $typeErrorModule.methods.setError.prepend(() => false),
})

forward({
  from: themeDropdownModule.methods.itemChanged,
  to: $themeErrorModule.methods.setError.prepend(() => false),
})

forward({
  from: resourceDescriptionChanged,
  to: $descriptionErrorModule.methods.setError.prepend(() => false),
})

forward({
  from: linkChanged,
  to: $linkErrorModule.methods.setError.prepend(() => false),
})

forward({
  from: uploadFileFx,
  to: $fileErrorModule.methods.setError.prepend(() => false),
})
