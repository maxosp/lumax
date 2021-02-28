import { forward, attach, sample, createEvent, split, merge, restore } from 'effector-root'
import { createSubjectFx } from '@/features/api/subject/create-subject'
import { addToast } from '@/features/toasts/toasts.model'
import { navigatePush } from '@/features/navigation'
import {
  $formToSend,
  subjectTitleErrorChanged,
  getMediaIcon,
  getMediaImage,
  uploadMedia,
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
    if (obj.name.trim().length && obj.name) {
      saveSubject()
    } else {
      if (!obj.name.trim().length) subjectTitleErrorChanged(true)
      addToast({ type: 'error', message: 'Необходимо заполнить все обязательные поля' })
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
    addToast({ type: 'success', message: 'Предмет успешно обновлен!' })
    if (ifRedirect) navigatePush({ name: 'subjects-list' })
    else navigatePush({ name: 'subjects-edit', params: { id: `${id}` } })
  },
})

const { noInternetConnection } = split(
  merge([
    saveSubjectFx.failData,
    getMediaIcon.failData,
    getMediaImage.failData,
    uploadMedia.failData,
  ]),
  { noInternetConnection: ({ status }) => status === undefined }
)
forward({
  from: noInternetConnection,
  to: addToast.prepend(() => ({ type: 'no-internet', message: 'Отсутствует подключение' })),
})
