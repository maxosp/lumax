import { createEvent, forward, restore, attach, createEffect } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { addToast } from '@/features/toasts/toasts.model'
import { LANGUAGE_DATA } from '@/pages/task-creation/test/tasks/MultipleChoiceOneAnswer/parts/constants'
import { getRandomId } from '@/pages/task-creation/test/tasks/utils'
import { DropdownItem } from '@/pages/common/types'
import { UploadMediaResponse } from '@/features/api/media/types'
import { AudioFile, MultipleChoiceOneOrManyQuestion } from '@/pages/task-creation/test/tasks/types'

export const uploadMedia = attach({
  effect: uploadMediaFx,
})

export const setWording = createEvent<string>()
export const $wording = restore(setWording, '')

export const setContaining = createEvent<string>()
export const $containing = restore(setContaining, '')

export const setAudioFiles = createEvent<AudioFile[]>()
export const $audioFiles = restore(setAudioFiles, [])

export const setAnswerExample = createEvent<string>()
export const $answerExample = restore(setAnswerExample, '')

export const setQuestionsAnswers = createEvent<MultipleChoiceOneOrManyQuestion[]>()
export const $questionsAnswers = restore(setQuestionsAnswers, [
  { id: getRandomId(), question: '', answer: '', mark: '', isCorrect: true },
])

export const setLanguage = createEvent<DropdownItem>()
export const $language = restore(setLanguage, LANGUAGE_DATA[0])

export const toggleMarksEnabling = createEvent<boolean>()
export const $makrsEnabled = restore(toggleMarksEnabling, false)

export const uploadAudioFiles = createEvent<FileList>()

const uploadAudioFilesFx = createEffect({
  handler: (files: FileList | null): Promise<UploadMediaResponse[]> =>
    Promise.all(
      Array.from(files || []).map(
        (file) =>
          new Promise<UploadMediaResponse>((resolve) => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('file_type', 'audio')
            const res = uploadMedia(formData).then((r) => r.body)
            resolve(res)
          })
      )
    ),
})

forward({
  from: uploadAudioFiles,
  to: [
    uploadAudioFilesFx,
    addToast.prepend(() => ({ type: 'loading', message: 'Идет загрузка файла(ов)' })),
  ],
})

forward({
  from: uploadAudioFilesFx.doneData,
  to: [
    setAudioFiles.prepend((files) => files.map((file) => ({ ...file, isLimited: true, limit: 0 }))),
    addToast.prepend(() => ({ type: 'success', message: 'Загрузка завершена' })),
  ],
})

export const $isAudioUploadLoading = uploadAudioFilesFx.pending
