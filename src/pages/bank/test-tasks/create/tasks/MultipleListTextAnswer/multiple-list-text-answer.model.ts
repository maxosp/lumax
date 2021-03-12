import { createEvent, forward, restore, attach, createEffect, combine, sample } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { addToast } from '@/features/toasts/toasts.model'
import { LANGUAGE_DATA } from '@/pages/bank/test-tasks/create/parts/languages-dropdown/constants'
import { DropdownItem } from '@/pages/common/types'
import { UploadMediaResponse } from '@/features/api/media/types'
import { AudioFile, MultipleListTextAnswer } from '@/pages/bank/test-tasks/create/tasks/types'

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

export const setAnswersList = createEvent<MultipleListTextAnswer[]>()
export const $answersList = restore(setAnswersList, [])

export const setTextTemplate = createEvent<string>()
export const $textTemplate = restore(setTextTemplate, '')

export const setLanguage = createEvent<DropdownItem>()
export const $language = restore(setLanguage, LANGUAGE_DATA[0])

export const toggleReorderEnabling = createEvent<boolean>()
export const $reorderEnabled = restore(toggleReorderEnabling, false)

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

sample({
  source: $audioFiles,
  clock: uploadAudioFilesFx.doneData,
  fn: (existFiles: AudioFile[], newFiles: UploadMediaResponse[]) => {
    addToast.prepend(() => ({ type: 'success', message: 'Загрузка завершена' }))
    return [...existFiles, ...newFiles.map((file) => ({ ...file, isLimited: true, limit: 0 }))]
  },
  target: setAudioFiles,
})

export const $isAudioUploadLoading = uploadAudioFilesFx.pending

export const $isFilled = combine(
  $wording,
  $containing,
  $answerExample,
  $answersList,
  (wording, containing, answerExample, answersList) =>
    wording &&
    containing &&
    answerExample &&
    answersList.length &&
    answersList.reduce(
      (acc, list) =>
        acc &&
        !!list.answers.length &&
        list.answers.reduce((accum, answer) => accum && !!answer.value, true),
      true
    )
)

export const $form = combine(
  $wording,
  $answerExample,
  $containing,
  $answersList,
  $audioFiles,
  $language,
  (wording, example_answer, containing, answersList, audio, language) => ({
    wording,
    example_answer,
    text: containing,
    question_data: {
      variant: answersList.map((list, idx) => ({
        number: idx + 1,
        options: list.answers.map(({ value }) => value),
      })),
    },
    correct_answer: answersList.map(
      (list) => list.answers.findIndex(({ isCorrect }) => isCorrect) + 1
    ),
    common_list_text_answer: null,
    audio: audio.map(({ id, isLimited, limit }) => ({
      id,
      ...(isLimited ? { audio_limit_count: limit } : {}),
    })),
    interface_language: language.title,
  })
)
