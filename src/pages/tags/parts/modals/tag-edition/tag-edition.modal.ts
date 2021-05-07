import { attach, combine, createEvent, forward, restore, sample } from 'effector-root'
import { condition } from 'patronum'
import { createError } from '@/lib/effector/error-generator'
import { DEFAULT_ID } from '@/pages/common/constants'
import { getTagFx } from '@/features/api/assignment/olympiad-tags/get-tag'
import { getTagsListFx } from '@/features/api/assignment/olympiad-tags/get-tags-list'
import { updateTagFx } from '@/features/api/assignment/update-tag'
import {
  $selectedClass,
  classesDropdownModule,
  setSelectedClass,
} from '@/pages/common/dropdowns/class/classes-dropdown.model'
import {
  $selectedSubject,
  setSelectedSubject,
  subjectsDropdownModule,
} from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { errorToastEvent, successToastEvent } from '@/features/toasts/toasts.model'
import { getTagsTreeLight } from '@/pages/tags/tags-page.model'
import { setDataToUpdateTree } from '@/pages/common/parts/tree/data-to-update-tree/data-to-update-tree.model'
import { Tag } from '@/features/api/assignment/types'

export const updateTag = attach({
  effect: updateTagFx,
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

export const $subjectErrorModule = createError()

export const $classErrorModule = createError()

export const $titleErrorModule = createError()

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
    if (
      obj.name.trim().length &&
      obj.study_year_id !== DEFAULT_ID &&
      obj.subject_id !== DEFAULT_ID
    ) {
      updateTag(obj)
      setDataToUpdateTree({ subject: obj.subject_id, study_year: obj.study_year_id })
    } else {
      if (!obj.name.trim().length) $titleErrorModule.methods.setError(true)
      if (obj.study_year_id === DEFAULT_ID) $classErrorModule.methods.setError(true)
      if (obj.subject_id === DEFAULT_ID) $subjectErrorModule.methods.setError(true)
      errorToastEvent('Необходимо заполнить все обязательные поля')
    }
  },
})

forward({
  from: tagTitleChanged,
  to: $titleErrorModule.methods.resetError,
})

forward({
  from: subjectsDropdownModule.methods.itemChanged,
  to: $subjectErrorModule.methods.resetError,
})

forward({
  from: classesDropdownModule.methods.itemChanged,
  to: $classErrorModule.methods.resetError,
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
    tag.subject && subjectsDropdownModule.methods.itemChanged(`${tag.subject.id}`)
    tag.subject &&
      setSelectedSubject({ id: tag.subject.id, name: `${tag.subject.id}`, title: tag.subject.name })
    tag.study_year && classesDropdownModule.methods.itemChanged(`${tag.study_year.id}`)
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
    successToastEvent('Тег был успешно обновлен!'),
    getTagsTreeLight.prepend(() => ({})),
    getTagsListFx.prepend(() => ({})),
    modalVisibilityChanged.prepend(() => false),
    canRefreshTableChanged.prepend(() => true),
  ],
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
    subjectsDropdownModule.methods.resetDropdown,
    classesDropdownModule.methods.resetDropdown,
    $titleErrorModule.methods.resetError,
    $subjectErrorModule.methods.resetError,
    $classErrorModule.methods.resetError,
    setSelectedSubject.prepend(() => null),
    setSelectedClass.prepend(() => null),
  ],
})
