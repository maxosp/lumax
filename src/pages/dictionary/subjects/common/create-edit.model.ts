import { createEffect, combine, attach, createEvent, restore, forward, sample } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { getMediaFx } from '@/features/api/media/get-media'
import { UploadMediaResponse } from '@/features/api/media/types'
import { $session } from '@/features/session/index'
import { addToast } from '@/features/toasts/toasts.model'
import { colorDropdownModule } from '@/pages/dictionary/subjects/common/colors/colors-dropdown.model'
import { CreateSubjectType } from '@/features/api/subject/types'

export const uploadMedia = attach({
  effect: uploadMediaFx,
})
export const getMediaIcon = attach({
  effect: getMediaFx,
  mapParams: (params: number) => params,
})
export const getMediaImage = attach({
  effect: getMediaFx,
  mapParams: (params: number) => params,
})

export const clearFields = createEvent<void>()

export const toggleIsMondatory = createEvent<boolean>()
export const $isModatory = restore(toggleIsMondatory, true).reset(clearFields)

export const resetSubjectTitle = createEvent<void>()
export const subjectTitleChanged = createEvent<string>()
export const $subjectTitle = restore(subjectTitleChanged, '').reset(resetSubjectTitle)

export const subjectTitleErrorChanged = createEvent<boolean>()
export const $subjectTitleError = restore(subjectTitleErrorChanged, false).reset(clearFields)

export const subjectDescriptionChanged = createEvent<string>()
export const $subjectDescription = restore(subjectDescriptionChanged, '').reset(clearFields)

export const useFulInfoChanged = createEvent<string>()
export const $useFulInfo = restore(useFulInfoChanged, '').reset(clearFields)

export const shortUsefulInfoChanged = createEvent<string>()
export const $shortUsefulInfo = restore(shortUsefulInfoChanged, '').reset(clearFields)
// иконка предмета
export const uploadIconSubject = createEvent<FileList>()
export const resetIconSubjectId = createEvent<void>()
export const iconSubjectIdChanged = createEvent<number>()
export const $iconSubjectId = restore(iconSubjectIdChanged, -1).reset(resetIconSubjectId)
export const iconSubjectChanged = createEvent<string>()
export const $iconSubject = restore(iconSubjectChanged, '').reset(resetIconSubjectId)
// картинка предмета
export const uploadImageSubject = createEvent<FileList>()
export const resetImageSubjectId = createEvent<void>()
export const imageSubjectIdChanged = createEvent<number>()
export const $imageSubjectId = restore(imageSubjectIdChanged, -1).reset(resetImageSubjectId)
export const imageSubjectChanged = createEvent<string>()
export const $imageSubject = restore(imageSubjectChanged, '').reset(resetImageSubjectId)
// данные для формы
export const $compareDataInsideModels = combine({
  subjectTitle: $subjectTitle,
  subjectDescription: $subjectDescription,
  useFulInfo: $useFulInfo,
  shortUsefulInfo: $shortUsefulInfo,
  iconSubjectId: $iconSubjectId,
  imageSubjectId: $imageSubjectId,
  isModatory: $isModatory,
})

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
export const $formToSend = combine(
  $compareDataInsideModels,
  $session,
  $dropDownData,
  (compareDataInsideModels, session, activeColor) => {
    const {
      subjectTitle,
      isModatory,
      subjectDescription,
      useFulInfo,
      shortUsefulInfo,
      iconSubjectId,
      imageSubjectId,
    } = compareDataInsideModels
    const data: CreateSubjectType = { name: subjectTitle, is_mandatory: isModatory }
    if (subjectDescription.length) data.description = subjectDescription
    if (useFulInfo.length) data.useful_info = useFulInfo
    if (shortUsefulInfo.length) data.short_useful_info = shortUsefulInfo
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
// чисти поля
forward({
  from: clearFields,
  to: [
    resetSubjectTitle,
    resetIconSubjectId,
    resetImageSubjectId,
    colorDropdownModule.methods.resetItem,
    colorDropdownModule.methods.resetSearchString,
  ],
})
