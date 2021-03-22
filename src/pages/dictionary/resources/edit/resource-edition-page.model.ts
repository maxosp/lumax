import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
import { debounce, every } from 'patronum'
import {
  $selectedSubject,
  subjectDropdownModule,
} from '@/pages/dictionary/resources/edit/parts/subjects/subjects.model'
import {
  $selectedClass,
  classDropdownModule,
} from '@/pages/dictionary/resources/edit/parts/class/class.model'
import { DEFAULT_ID } from '@/pages/common/constants'
import { ResourceType } from '@/features/api/media/types'
import { getResourceFx } from '@/features/api/media/get-resource'
import {
  $selectedTheme,
  setSelectedTheme,
  themeDropdownModule,
  getThemeData,
} from '@/pages/dictionary/resources/edit/parts/theme/theme.model'
import {
  $fileData,
  uploadFileFx,
  fileDataChanged,
} from '@/pages/dictionary/resources/edit/parts/file-upload/file-upload.model'
import {
  $selectedType,
  setSelectedType,
  typeDropdownModule,
} from '@/pages/dictionary/resources/edit/parts/type/type-dropdown.model'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'
import { errorToastEvent, successToastEvent } from '@/features/toasts/toasts.model'
import { isLinkValid } from '@/lib/validators/url'
import { updateResourceFx } from '@/features/api/media/update-resource'
import { navigatePush } from '@/features/navigation'
import { createError } from '@/lib/effector/error-generator'

const updateResourceDataFx = attach({
  effect: updateResourceFx,
})

export const getResourceToUpdate = attach({
  effect: getResourceFx,
})

const updateResource = createEvent<void>()

export const clearFields = createEvent<void>()

export const edit = createEvent<void>()
const checkIfResourceCanBeSend = createEvent<void>()

export const redirectAfterSaveChanged = createEvent<boolean>()
const $redirectAfterSave = restore(redirectAfterSaveChanged, false)

export const resourceDescriptionChanged = createEvent<string>()
export const $resourceDescription = restore(resourceDescriptionChanged, '').reset(clearFields)

export const linkChanged = createEvent<string>()
export const resetLink = createEvent<void>()
export const $link = restore(linkChanged, '').reset(clearFields)

forward({
  from: clearFields,
  to: [
    classDropdownModule.methods.resetItem,
    classDropdownModule.methods.resetSearchString,
    subjectDropdownModule.methods.resetItem,
    subjectDropdownModule.methods.resetSearchString,
    themeDropdownModule.methods.resetItem,
    themeDropdownModule.methods.resetSearchString,
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
sample({
  clock: getResourceToUpdate.done,
  source: getResourceFx.doneData.map((data) => data.body),
  fn: (resource: ResourceType) => {
    getThemeData(resource.theme!)
    linkChanged(resource.link!)
    typeDropdownModule.methods.itemChanged(resource.resource_type)
    setSelectedType({ name: resource.resource_type, title: '' })
    $formToSend.map((el) => (el.id = resource.id))
    themeDropdownModule.methods.itemChanged(`${resource.theme}`)
    setSelectedTheme({ name: `${resource.theme}`, title: '' })
    resourceDescriptionChanged(resource.text!)
    fileDataChanged(resource.media!)
  },
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
  to: getThemesTreeListFx.prepend((data) => {
    return {
      study_year: data.study_year ? data.study_year : undefined,
      subject: data.subject ? data.subject : undefined,
      is_prerequisite: false,
    }
  }),
})

forward({
  from: edit,
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
    if (errors === 0) updateResource()
    else if (errors > 0) errorToastEvent('Необходимо заполнить все обязательные поля')
  },
})

sample({
  clock: updateResource,
  source: $formToSend,
  target: updateResourceDataFx,
})

const $ifRedirect = sample({
  clock: updateResourceDataFx,
  source: $redirectAfterSave,
  fn: (isRedirect: boolean) => isRedirect,
})

sample({
  source: $ifRedirect,
  clock: updateResourceDataFx.doneData.map((data) => data.body.id),
  fn: (ifRedirect: boolean, id: number) => {
    successToastEvent('Ресурс успешно обновлен!')
    if (ifRedirect) navigatePush({ name: 'resources-list' })
    else getResourceToUpdate(id)
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
