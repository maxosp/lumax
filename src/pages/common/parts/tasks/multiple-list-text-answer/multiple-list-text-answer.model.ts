import { createEvent, forward, restore, attach, createEffect, combine, sample } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { addToast, successToastEvent } from '@/features/toasts/toasts.model'
import { UploadMediaResponse } from '@/features/api/media/types'
import { AudioFile, MultipleListTextAnswer } from '@/pages/common/parts/tasks/types'
import { TestAssignment } from '@/features/api/assignment/types'

export const uploadMedia = attach({
  effect: uploadMediaFx,
})

export const clearFields = createEvent<void>()

export const setWording = createEvent<string>()
export const $wording = restore(setWording, '').reset(clearFields)

export const setContaining = createEvent<string>()
export const $containing = restore(setContaining, '').reset(clearFields)

export const setAudioFiles = createEvent<AudioFile[]>()
export const $audioFiles = restore(setAudioFiles, []).reset(clearFields)

export const setAnswerExample = createEvent<string>()
export const $answerExample = restore(setAnswerExample, '').reset(clearFields)

export const setAnswersList = createEvent<MultipleListTextAnswer[]>()
export const $answersList = restore(setAnswersList, []).reset(clearFields)

export const setTextTemplate = createEvent<string>()
export const $textTemplate = restore(setTextTemplate, '').reset(clearFields)

export const toggleReorderEnabling = createEvent<boolean>()
export const $reorderEnabled = restore(toggleReorderEnabling, false).reset(clearFields)

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
    successToastEvent('Загрузка завершена')
    return [...existFiles, ...newFiles.map((file) => ({ ...file, isLimited: false, limit: 1 }))]
  },
  target: setAudioFiles,
})

export const $isAudioUploadLoading = uploadAudioFilesFx.pending

export const $isFilled = combine(
  $wording,
  $answersList,
  (wording, answersList) =>
    wording &&
    answersList.length &&
    answersList.every(
      (list) =>
        list.answers.length > 1 &&
        list.answers.every((answer) => answer.value) &&
        list.answers.some((answer) => answer.isCorrect)
    )
)

export const $form = combine(
  $wording,
  $answerExample,
  $containing,
  $answersList,
  $textTemplate,
  $audioFiles,
  (wording, example_answer, containing, answersList, text_template, audio) => ({
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
    common_list_answer_choices: text_template,
    audio: audio.map(({ id, isLimited, limit }) => ({
      id,
      ...(isLimited ? { audio_limit_count: limit } : {}),
    })),
  })
)

export const initAssignment = createEvent<TestAssignment>()

forward({
  from: initAssignment,
  to: [
    setWording.prepend((data) => data.wording || ''),
    setContaining.prepend((data) => data.text || ''),
    setAnswerExample.prepend((data) => data.example_answer || ''),
    setTextTemplate.prepend((data) => data.common_list_answer_choices),
    setAnswersList.prepend((data) =>
      data.question_data.variants.map((variant: any, idx: number) => ({
        id: idx + 1,
        answers: variant.options.map((value: string, index: number) => {
          let isCorrect = false
          if (data.correct_answer[idx] === `${index}`) {
            isCorrect = true
          }
          return {
            id: index + 1,
            value,
            isCorrect,
          }
        }),
      }))
    ),
  ],
})
