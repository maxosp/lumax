import {
  createEffect,
  combine,
  split,
  forward,
  merge,
  attach,
  sample,
  createEvent,
  restore,
} from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { createSubjectFx } from '@/features/api/subject/create-subject'
import { updateSubjectFx } from '@/features/api/subject/update-subject'
import { getSubjectFx } from '@/features/api/subject/get-subject'
import { getMediaFx } from '@/features/api/media/get-media'
import { $session } from '@/features/session/index'
import { CreateSubjectType, Subject } from '@/features/api/subject/types'
import { UploadMediaResponse } from '@/features/api/media/types'
import { navigatePush, router } from '@/features/navigation'
import { addToast } from '@/features/toasts/toasts.model'
import { colorDropdownModule } from '@/pages/subjects/create/parts/colors/colors-dropdown.model'

// методы запросов на бэк
const saveSubjectFx = attach({
  effect: createSubjectFx,
})
const updateSubjectDataFx = attach({
  effect: updateSubjectFx,
  mapParams: (params: CreateSubjectType) => params,
})
const uploadMedia = attach({
  effect: uploadMediaFx,
})
const getSubjectToUpdate = attach({
  effect: getSubjectFx,
  mapParams: (params: number) => params,
})
const getMediaIcon = attach({
  effect: getMediaFx,
  mapParams: (params: number) => params,
})
const getMediaImage = attach({
  effect: getMediaFx,
  mapParams: (params: number) => params,
})

const saveSubject = createEvent<void>()
const updateSubject = createEvent<void>()

export const pareparePageForEditing = createEvent<number>()

export const isEditingSubjectChanged = createEvent<boolean>()
export const $isEditingSubject = restore<boolean>(isEditingSubjectChanged, false)

export const clearFields = createEvent<void>()

export const save = createEvent<void>()
const checkIfSubjectCanBeSend = createEvent<void>()

export const redirectAfterSaveChanged = createEvent<boolean>()
const $redirectAfterSave = restore(redirectAfterSaveChanged, false)

// поля
export const resetMondatory = createEvent<void>()
export const toggleIsMondatory = createEvent<boolean>()
export const $isModatory = restore(toggleIsMondatory, false).reset(resetMondatory)

export const resetSubjectTitle = createEvent<void>()
export const subjectTitleChanged = createEvent<string>()
export const $subjectTitle = restore(subjectTitleChanged, '').reset(resetSubjectTitle)
const subjectTitleErrorChanged = createEvent<boolean>()
export const $subjectTitleError = restore(subjectTitleErrorChanged, false)

export const resetSubjectDescription = createEvent<void>()
export const subjectDescriptionChanged = createEvent<string>()
export const $subjectDescription = restore(subjectDescriptionChanged, '').reset(
  resetSubjectDescription
)

export const resetUseFulInfo = createEvent<void>()
export const useFulInfoChanged = createEvent<string>()
export const $useFulInfo = restore(useFulInfoChanged, '').reset(resetUseFulInfo)

export const resetShortUsefulInfo = createEvent<void>()
export const shortUsefulInfoChanged = createEvent<string>()
export const $shortUsefulInfo = restore(shortUsefulInfoChanged, '').reset(resetShortUsefulInfo)

export const uploadIconSubject = createEvent<FileList>()
export const resetIconSubjectId = createEvent<void>()
export const iconSubjectIdChanged = createEvent<number>()
export const $iconSubjectId = restore(iconSubjectIdChanged, -1).reset(resetIconSubjectId)
export const iconSubjectChanged = createEvent<string>()
export const $iconSubject = restore(iconSubjectChanged, '').reset(resetIconSubjectId)

export const uploadImageSubject = createEvent<FileList>()
export const resetImageSubjectId = createEvent<void>()
export const imageSubjectIdChanged = createEvent<number>()
export const $imageSubjectId = restore(imageSubjectIdChanged, -1).reset(resetImageSubjectId)
export const imageSubjectChanged = createEvent<string>()
export const $imageSubject = restore(imageSubjectChanged, '').reset(resetImageSubjectId)

// загрузка медиа на бэк
const uploadIconSubjectFx = createEffect({
  handler: (files: FileList | null): Promise<UploadMediaResponse[]> =>
    Promise.all(
      Array.from(files || []).map(
        (file) =>
          new Promise<UploadMediaResponse>((resolve) => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('file_type', 'image')
            const res = uploadMedia(formData).then((r) => r.body)
            resolve(res)
          })
      )
    ),
})
const uploadImageSubjectFx = createEffect({
  handler: (files: FileList | null): Promise<UploadMediaResponse[]> =>
    Promise.all(
      Array.from(files || []).map(
        (file) =>
          new Promise<UploadMediaResponse>((resolve) => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('file_type', 'image')
            const res = uploadMedia(formData).then((r) => r.body)
            resolve(res)
          })
      )
    ),
})

forward({
  from: clearFields,
  to: [
    isEditingSubjectChanged.prepend(() => false),
    resetMondatory,
    resetSubjectTitle,
    resetSubjectDescription,
    resetUseFulInfo,
    resetShortUsefulInfo,
    colorDropdownModule.methods.resetItem,
    colorDropdownModule.methods.resetSearchString,
    resetIconSubjectId,
    resetImageSubjectId,
  ],
})

// данные для формы
const $compareDataInsideModels = combine({
  subjectTitle: $subjectTitle,
  subjectDescription: $subjectDescription,
  useFulInfo: $useFulInfo,
  shortUsefulInfo: $shortUsefulInfo,
  iconSubjectId: $iconSubjectId,
  imageSubjectId: $imageSubjectId,
  isModatory: $isModatory,
})
const $dropDownData = combine(
  {
    list: colorDropdownModule.store.$itemsDropdown,
    elem: colorDropdownModule.store.$item,
  },
  ({ list, elem }) => {
    const element = list.find((item) => item.name === elem)
    return element || null
  }
)
const $compareDataOutsideModels = combine({ session: $session, activeColor: $dropDownData })
export const $formToSend = combine(
  $compareDataInsideModels,
  $compareDataOutsideModels,
  (compareDataInsideModels, compareDataOutsideModels) => {
    const {
      subjectTitle,
      isModatory,
      subjectDescription,
      useFulInfo,
      shortUsefulInfo,
      iconSubjectId,
      imageSubjectId,
    } = compareDataInsideModels
    const { session, activeColor } = compareDataOutsideModels
    const data: CreateSubjectType = { name: subjectTitle, is_mandatory: isModatory }
    if (router.currentRoute.params.id) data.id = +router.currentRoute.params.id
    if (subjectDescription.length) data.description = subjectDescription
    if (useFulInfo.length) data.useful_info = useFulInfo
    if (useFulInfo.length) data.short_useful_info = shortUsefulInfo
    if (iconSubjectId && iconSubjectId > -1) data.icon = iconSubjectId
    if (imageSubjectId && imageSubjectId > -1) data.image = imageSubjectId
    if (session) {
      data.author_id = session.id
      data.author = {
        first_name: session.first_name,
        last_name: session.last_name,
        is_moderator: session.is_moderator,
        is_teacher: session.is_teacher,
        is_student: session.is_student,
      }
    }
    if (activeColor) {
      data.color_id = activeColor.id
      data.color = {
        id: +activeColor.name,
        name: activeColor.title,
        value: activeColor.value || '',
      }
    }
    return data
  }
)

// дергаем отправку формы
forward({
  from: save,
  to: checkIfSubjectCanBeSend.prepend(() => ({})),
})

sample({
  source: { $formToSend, $isEditingSubject },
  clock: checkIfSubjectCanBeSend,
  fn: (obj) => {
    if (obj.$formToSend.name.trim().length && obj.$formToSend.name) {
      obj.$isEditingSubject ? updateSubject() : saveSubject()
    } else {
      if (!obj.$formToSend.name.trim().length) subjectTitleErrorChanged(true)
      addToast({ type: 'error', message: 'Необходимо заполнить все обязательные поля' })
    }
  },
})

const $ifRedirect = sample({
  clock: [saveSubjectFx, updateSubjectDataFx],
  source: $redirectAfterSave,
  fn: (isRedirect: boolean) => isRedirect,
})

forward({
  from: uploadIconSubject,
  to: [
    uploadIconSubjectFx,
    addToast.prepend(() => ({ type: 'loading', message: 'Идет загрузка файла(ов)' })),
  ],
})
forward({
  from: uploadIconSubjectFx.doneData,
  to: [
    iconSubjectIdChanged.prepend((files) => files[0].id),
    addToast.prepend(() => ({ type: 'success', message: 'Загрузка завершена' })),
  ],
})

forward({
  from: uploadImageSubject,
  to: [
    uploadImageSubjectFx,
    addToast.prepend(() => ({ type: 'loading', message: 'Идет загрузка файла(ов)' })),
  ],
})
forward({
  from: uploadImageSubjectFx.doneData,
  to: [
    imageSubjectIdChanged.prepend((files) => files[0].id),
    addToast.prepend(() => ({ type: 'success', message: 'Загрузка завершена' })),
  ],
})

// дергаем методы create & update
forward({
  from: pareparePageForEditing,
  to: [isEditingSubjectChanged.prepend(() => true), getSubjectToUpdate],
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
    if (subject.color) colorDropdownModule.methods.itemChanged(`${subject.color.id}`)
  },
})
// агрегация данных медиа
sample({
  clock: iconSubjectIdChanged,
  source: $iconSubjectId,
  target: getMediaIcon,
})
forward({
  from: getMediaIcon.doneData,
  to: iconSubjectChanged.prepend(({ body }) => body.file),
})
sample({
  clock: imageSubjectIdChanged,
  source: $imageSubjectId,
  target: getMediaImage,
})
forward({
  from: getMediaImage.doneData,
  to: imageSubjectChanged.prepend(({ body }) => body.file),
})
//
sample({
  clock: saveSubject,
  source: $formToSend,
  target: saveSubjectFx,
})
sample({
  clock: updateSubject,
  source: $formToSend,
  target: updateSubjectDataFx,
})

const { noInternetConnection } = split(
  merge([saveSubjectFx.failData, updateSubjectDataFx.failData]),
  { noInternetConnection: ({ status }) => status === undefined }
)
forward({
  from: noInternetConnection,
  to: addToast.prepend(() => ({ type: 'no-internet', message: 'Отсутствует подключение' })),
})

// create & update
sample({
  source: $ifRedirect,
  clock: saveSubjectFx.doneData.map((data) => data.body.id),
  fn: (ifRedirect: boolean, id: number) => {
    addToast({ type: 'success', message: 'Предмет успешно создан!' })
    if (ifRedirect) navigatePush({ name: 'subjects' })
    else pareparePageForEditing(id)
  },
})
sample({
  source: $ifRedirect,
  clock: updateSubjectDataFx.doneData.map((data) => data.body.id),
  fn: (ifRedirect: boolean, id: number) => {
    addToast({ type: 'success', message: 'Предмет успешно обновлен!' })
    if (ifRedirect) navigatePush({ name: 'subjects' })
    else pareparePageForEditing(id)
  },
})
// сбрасываем ошибки
forward({
  from: subjectTitleChanged,
  to: subjectTitleErrorChanged.prepend(() => false),
})
