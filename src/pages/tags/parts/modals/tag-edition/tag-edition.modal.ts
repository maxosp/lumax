import { addToast } from '@/features/toasts/toasts.model'
import { attach, combine, createEvent, forward, merge, restore, sample, split } from 'effector-root'
import {
  $selectedClass,
  classDropdownModule,
  setSelectedClass,
} from '@/pages/tags/parts/modals/tag-edition/parts/class/class-dropdown.model'
import {
  $selectedSubject,
  setSelectedSubject,
  subjectDropdownModule,
} from '@/pages/tags/parts/modals/tag-edition/parts/subject/subject-dropdown.model'
import { getTagFx } from '@/features/api/assignment/get-tag'
import { CreateTagType, Tag } from '@/features/api/assignment/types'
import { DEFAULT_ID } from '@/pages/tags/constants'
import { updateTagFx } from '@/features/api/assignment/update-tag'
import { getTagsListFx } from '@/features/api/assignment/get-tags-list'
import { condition } from 'patronum'
import { getTagsTreeFx } from '@/features/api/assignment/get-tags-tree'
import { getTagsTree } from '@/pages/tags/tags-page.model'

export const updateTag = attach({
  effect: updateTagFx,
  mapParams: (params: CreateTagType) => params,
})

export const canRefreshTableChanged = createEvent<boolean>()
export const $canRefreshTable = restore<boolean>(canRefreshTableChanged, false)
export const loadModalToEdit = createEvent<number>()
export const submit = createEvent<void>()
export const checkIfThemeCanBeSend = createEvent<void>()
export const clearFields = createEvent<void>()

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

export const tagTitleChanged = createEvent<string>()
const tagTitleReset = createEvent<void>()
export const $tagTitle = restore(tagTitleChanged, '').reset(tagTitleReset)

const subjectErrorChanged = createEvent<boolean>()
export const $subjectError = restore(subjectErrorChanged, false)

const classErrorChanged = createEvent<boolean>()
export const $classError = restore(classErrorChanged, false)

const titleErrorChanged = createEvent<boolean>()
export const $titleError = restore(titleErrorChanged, false)

const $form = combine({
  id: DEFAULT_ID,
  name: $tagTitle,
  study_year_id: $selectedClass.map((data) => (data ? +data.name : DEFAULT_ID)),
  subject_id: $selectedSubject.map((data) => (data ? +data.name : DEFAULT_ID)),
})

sample({
  source: $form,
  clock: checkIfThemeCanBeSend,
  fn: (obj) => {
    if (obj.name.trim().length && obj.study_year_id !== DEFAULT_ID && obj.subject_id !== DEFAULT_ID)
      updateTag(obj)
    else {
      if (!obj.name.trim().length) titleErrorChanged(true)
      if (obj.study_year_id === DEFAULT_ID) classErrorChanged(true)
      if (obj.subject_id === DEFAULT_ID) subjectErrorChanged(true)
      addToast({ type: 'error', message: 'Необходимо заполнить все обязательные поля' })
    }
  },
})

forward({
  from: tagTitleChanged,
  to: titleErrorChanged.prepend(() => false),
})

forward({
  from: subjectDropdownModule.methods.itemChanged,
  to: subjectErrorChanged.prepend(() => false),
})

forward({
  from: classDropdownModule.methods.itemChanged,
  to: classErrorChanged.prepend(() => false),
})

forward({
  from: loadModalToEdit,
  to: [
    getTagFx,
    modalVisibilityChanged.prepend(() => true),
    canRefreshTableChanged.prepend(() => false),
  ],
})

sample({
  clock: getTagFx.doneData.map((data) => data.body),
  fn: (tag: Tag) => {
    $form.map((data) => (data.id = tag.id))
    tagTitleChanged(tag.name)
    tag.subject && subjectDropdownModule.methods.itemChanged(`${tag.subject.id}`)
    tag.subject &&
      setSelectedSubject({ id: tag.subject.id, name: `${tag.subject.id}`, title: tag.subject.name })
    tag.study_year && classDropdownModule.methods.itemChanged(`${tag.study_year.id}`)
    tag.study_year &&
      setSelectedClass({
        id: tag.study_year.id,
        name: `${tag.study_year.id}`,
        title: tag.study_year.name,
      })
  },
})
forward({
  from: updateTagFx.doneData,
  to: [
    addToast.prepend(() => ({ type: 'success', message: 'Тег был успешно обновлен!' })),
    getTagsTree.prepend(() => ({})),
    getTagsListFx.prepend(() => ({})),
    modalVisibilityChanged.prepend(() => false),
    canRefreshTableChanged.prepend(() => true),
  ],
})

const { noInternetConnection } = split(
  merge([getTagsListFx.failData, getTagFx.failData, updateTagFx.failData, getTagsTreeFx.failData]),
  { noInternetConnection: ({ status }) => status === undefined }
)

forward({
  from: noInternetConnection,
  to: addToast.prepend(() => ({ type: 'no-internet', message: 'Отсутствует подключение' })),
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
    setSelectedSubject.prepend(() => null),
    setSelectedClass.prepend(() => null),
  ],
})
