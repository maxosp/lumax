import { forward, attach, sample, createEvent, restore } from 'effector-root'
import { createSubjectFx } from '@/features/api/subject/create-subject'
import { errorToastEvent, successToastEvent } from '@/features/toasts/toasts.model'
import { navigatePush } from '@/features/navigation'
import {
  $formToSend,
  subjectTitleErrorChanged,
} from '@/pages/dictionary/subjects/common/create-edit.model'

const saveSubjectFx = attach({
  effect: createSubjectFx,
})

export const save = createEvent<void>()
const saveSubject = createEvent<void>()
const checkIfSubjectCanBeSend = createEvent<void>()

export const changeIfRedirect = createEvent<boolean>()
const $ifRedirect = restore(changeIfRedirect, false)

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
      saveSubject()
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
  clock: saveSubject,
  source: $formToSend,
  target: saveSubjectFx,
})
sample({
  source: $ifRedirect,
  clock: saveSubjectFx.doneData.map((data) => data.body.id),
  fn: (ifRedirect: boolean, id: number) => {
    successToastEvent('Предмет успешно обновлен!')
    if (ifRedirect) navigatePush({ name: 'subjects-list' })
    else navigatePush({ name: 'subjects-edit', params: { id: `${id}` } })
  },
})
