import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
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
  setSelectedTheme,
  themeDropdownModule,
} from '@/pages/dictionary/resources/create/parts/theme/theme.model'
import {
  $selectedType,
  setSelectedType,
  typeDropdownModule,
} from '@/pages/dictionary/resources/create/parts/type/type-dropdown.model'
import { DEFAULT_ID } from '@/pages/common/constants'
import {
  $fileData,
  fileDataChanged,
  uploadFileFx,
} from '@/pages/dictionary/resources/create/parts/file-upload/file-upload.model'
import { isLinkValid } from '@/lib/validators/url'
import { createResourceFx } from '@/features/api/media/create-resource'
import { errorToastEvent, successToastEvent } from '@/features/toasts/toasts.model'
import { navigatePush } from '@/features/navigation'
import { createError } from '@/lib/effector/error-generator'
import { getThemeFx } from '@/features/api/subject/get-theme'
import { getSubjectFx } from '@/features/api/subject/get-subject'

const getTheme = attach({
  effect: getThemeFx,
})

const getSubject = attach({
  effect: getSubjectFx,
})

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

export const initAssignment =
  createEvent<{
    theme: number
    subject: number
    class: number
  }>()

forward({
  from: initAssignment,
  to: [
    getTheme.prepend((data) => data.theme),
    getSubject.prepend((data) => data.subject),
    setSelectedClass.prepend((data) => ({
      name: `${data.class}`,
      title: `${data.class} класс`,
    })),
    classDropdownModule.methods.itemChanged.prepend((data) => `${data.class}`),
  ],
})

forward({
  from: getSubject.doneData.map((data) => data.body),
  to: [
    setSelectedSubject.prepend((subject) => ({
      name: `${subject.id}`,
      title: subject.name,
    })),
    subjectDropdownModule.methods.itemChanged.prepend((subject) => `${subject.id}`),
  ],
})

forward({
  from: getTheme.doneData.map((data) => data.body),
  to: [
    setSelectedTheme.prepend((theme) => ({
      name: `${theme.id}`,
      title: theme.name,
    })),
    themeDropdownModule.methods.itemChanged.prepend((theme) => `${theme.id}`),
  ],
})

forward({
  from: clearFields,
  to: [
    classDropdownModule.methods.resetDropdown,
    subjectDropdownModule.methods.resetDropdown,
    themeDropdownModule.methods.resetDropdown,
    typeDropdownModule.methods.resetDropdown,
    setSelectedSubject.prepend(() => null),
    setSelectedClass.prepend(() => null),
    fileDataChanged.prepend(() => null),
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
  media_id: $fileData.map((data) => (data ? data.id : null)),
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
    if (errors === 0) {
      saveResource()
    } else if (errors > 0) errorToastEvent('Необходимо заполнить все обязательные поля')
  },
})

sample({
  clock: saveResource,
  source: $formToSend,
  target: createResource,
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
    successToastEvent('Обучающий ресурс успешно создан!')
    if (ifRedirect) navigatePush({ name: 'resources-list' })
    else navigatePush({ name: 'resources-edit', params: { id: `${id}` } })
  },
})

forward({
  from: setSelectedType,
  to: resetErrors,
})
forward({
  from: typeDropdownModule.methods.itemChanged,
  to: $typeErrorModule.methods.resetError,
})

forward({
  from: themeDropdownModule.methods.itemChanged,
  to: $themeErrorModule.methods.resetError,
})

forward({
  from: resourceDescriptionChanged,
  to: $descriptionErrorModule.methods.resetError,
})

forward({
  from: linkChanged,
  to: $linkErrorModule.methods.resetError,
})

forward({
  from: uploadFileFx,
  to: $fileErrorModule.methods.resetError,
})
