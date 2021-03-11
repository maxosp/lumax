import { addToast } from '@/features/toasts/toasts.model'
import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
import {
  $selectedClass,
  classDropdownModule,
  setSelectedClass,
} from '@/pages/tags/parts/modals/tag-creation/parts/class/class-dropdown.model'
import {
  $selectedSubject,
  setSelectedSubject,
  subjectDropdownModule,
} from '@/pages/tags/parts/modals/tag-creation/parts/subject/subject-dropdown.model'
import { createTagFx } from '@/features/api/assignment/create-tag'
import { CreateTagType } from '@/features/api/assignment/types'
import { getTagsListFx } from '@/features/api/assignment/get-tags-list'
import { condition } from 'patronum'
import { canRefreshTableChanged } from '@/pages/tags/parts/modals/tag-edition/tag-edition.modal'
import { getTagsTree } from '@/pages/tags/tags-page.model'
import { createError } from '@/lib/effector/error-generator'
import { DEFAULT_ID } from '@/pages/common/constants'

export const createTag = attach({
  effect: createTagFx,
  mapParams: (params: CreateTagType) => params,
})

export const canRefreshAfterCreationChange = createEvent<boolean>()
export const $canRefreshTableAfterCreation = restore<boolean>(canRefreshAfterCreationChange, false)

export const createTagFromTree = createEvent<{ class_id: number; subject_id: number }>()

export const checkIfThemeCanBeSend = createEvent<void>()
export const clearFields = createEvent<void>()

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

export const tagTitleChanged = createEvent<string>()
const tagTitleReset = createEvent<void>()
export const $tagTitle = restore(tagTitleChanged, '').reset(tagTitleReset)

export const $subjectErrorModule = createError()

export const $classErrorModule = createError()

export const $titleErrorModule = createError()

const $form = combine({
  name: $tagTitle,
  study_year_id: $selectedClass.map((data) => (data && data.id ? +data.id : DEFAULT_ID)),
  subject_id: $selectedSubject.map((data) => (data && data.id ? +data.id : DEFAULT_ID)),
})

sample({
  source: $form,
  clock: checkIfThemeCanBeSend,
  fn: (obj) => {
    if (obj.name.trim().length && obj.study_year_id !== DEFAULT_ID && obj.subject_id !== DEFAULT_ID)
      createTag(obj)
    else {
      if (!obj.name.trim().length) $titleErrorModule.methods.setError(true)
      if (obj.study_year_id === DEFAULT_ID) $classErrorModule.methods.setError(true)
      if (obj.subject_id === DEFAULT_ID) $subjectErrorModule.methods.setError(true)
      addToast({ type: 'error', message: 'Необходимо заполнить все обязательные поля' })
    }
  },
})

sample({
  clock: createTagFromTree,
  fn: (tag: { class_id: number; subject_id: number }) => {
    classDropdownModule.methods.itemChanged(`${tag.class_id}`)
    setSelectedClass({ id: tag.class_id })
    subjectDropdownModule.methods.itemChanged(`${tag.subject_id}`)
    setSelectedSubject({ id: tag.subject_id })
    modalVisibilityChanged(true)
  },
})

forward({
  from: tagTitleChanged,
  to: $titleErrorModule.methods.resetError,
})

forward({
  from: subjectDropdownModule.methods.itemChanged,
  to: $subjectErrorModule.methods.resetError,
})

forward({
  from: classDropdownModule.methods.itemChanged,
  to: $classErrorModule.methods.resetError,
})

condition({
  source: modalVisibilityChanged,
  if: (payload: boolean) => !payload,
  then: clearFields,
})

forward({
  from: clearFields,
  to: [
    tagTitleReset,
    subjectDropdownModule.methods.resetItem,
    subjectDropdownModule.methods.resetSearchString,
    classDropdownModule.methods.resetItem,
    classDropdownModule.methods.resetSearchString,
    $titleErrorModule.methods.resetError,
    $subjectErrorModule.methods.resetError,
    $classErrorModule.methods.resetError,
    canRefreshTableChanged.prepend(() => false),
    setSelectedClass.prepend(() => null),
    setSelectedSubject.prepend(() => null),
  ],
})

forward({
  from: createTagFx.doneData,
  to: [
    getTagsListFx.prepend(() => ({})),
    getTagsTree.prepend(() => ({})),
    modalVisibilityChanged.prepend(() => false),
    addToast.prepend(() => ({ type: 'success', message: 'Тег был успешно создан!' })),
    canRefreshAfterCreationChange.prepend(() => true),
  ],
})
