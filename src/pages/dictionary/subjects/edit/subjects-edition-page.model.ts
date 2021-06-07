import { combine, forward, attach, sample, createEvent, restore } from 'effector-root'
import { updateSubjectFx } from '@/features/api/subject/update-subject'
import { getSubjectFx } from '@/features/api/subject/get-subject'
import { Subject } from '@/features/api/subject/types'
import {
  $formToSend,
  clearFields,
  subjectTitleErrorChanged,
  toggleIsMondatory,
  subjectTitleChanged,
  subjectDescriptionChanged,
  useFulInfoChanged,
  shortUsefulInfoChanged,
  iconSubjectIdChanged,
  imageSubjectIdChanged,
} from '@/pages/dictionary/subjects/common/create-edit.model'
import { colorsDropdownModel } from '@/pages/dictionary/subjects/common/colors/colors-dropdown.model'
import { errorToastEvent, successToastEvent } from '@/features/toasts/toasts.model'
import { navigatePush } from '@/features/navigation'

const updateSubjectDataFx = attach({
  effect: updateSubjectFx,
})
const getSubjectToUpdate = attach({
  effect: getSubjectFx,
})

export const save = createEvent<void>()
const updateSubject = createEvent<void>()
const checkIfSubjectCanBeSend = createEvent<void>()

export const changeIdSubject = createEvent<number>()
const $idSubject = restore(changeIdSubject, -1)

export const changeIfRedirect = createEvent<boolean>()
const $ifRedirect = restore(changeIfRedirect, false)

const $modifyForm = combine($formToSend, $idSubject, (formToSend, idSubject) => ({
  ...formToSend,
  id: idSubject,
}))
// дергаем отправку формы
forward({
  from: save,
  to: checkIfSubjectCanBeSend.prepend(() => ({})),
})
sample({
  source: $formToSend,
  clock: checkIfSubjectCanBeSend,
  fn: (obj) => {
    if (obj.name && obj.name.trim().length < 31) {
      updateSubject()
    } else if (obj.name && obj.name.trim().length > 30) {
      subjectTitleErrorChanged(true)
      errorToastEvent('Название предмета содержит более 30 символов')
    } else {
      if (!obj.name.trim().length) subjectTitleErrorChanged(true)
      errorToastEvent('Необходимо заполнить все обязательные поля')
    }
  },
})
sample({
  clock: updateSubject,
  source: $modifyForm,
  target: updateSubjectDataFx,
})
sample({
  source: $ifRedirect,
  clock: updateSubjectDataFx.doneData.map((data) => data.body.id),
  fn: (ifRedirect: boolean) => {
    successToastEvent('Предмет успешно обновлен!')
    if (ifRedirect) navigatePush({ name: 'subjects-list' })
  },
})
// получаем предмет
sample({
  clock: changeIdSubject,
  source: $idSubject,
  target: getSubjectToUpdate,
})
sample({
  clock: getSubjectToUpdate.done,
  source: getSubjectFx.doneData.map((data) => data.body),
  fn: (subject: Subject) => {
    toggleIsMondatory(subject.is_mandatory)
    subjectTitleChanged(subject.name)
    subjectDescriptionChanged(subject.description)
    useFulInfoChanged(subject.useful_info)
    shortUsefulInfoChanged(subject.short_useful_info)
    if (subject.icon) iconSubjectIdChanged(subject.icon)
    if (subject.image) imageSubjectIdChanged(subject.image)
    if (subject.color) colorsDropdownModel.methods.itemChanged(`${subject.color.id}`)
  },
})

// очистка полей
forward({
  from: clearFields,
  to: [colorsDropdownModel.methods.resetItem, colorsDropdownModel.methods.resetSearchString],
})
