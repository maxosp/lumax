import { createEvent, forward, restore, attach, createEffect, combine, sample } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { addToast, successToastEvent } from '@/features/toasts/toasts.model'
import { UploadMediaResponse } from '@/features/api/media/types'
import { AudioFile, ShortClosedAnswer } from '@/pages/common/parts/tasks/types'
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

export const setCorrectAnswerInputs = createEvent<ShortClosedAnswer[]>()
export const $correctAnswerInputs = restore(setCorrectAnswerInputs, [{ id: 0, value: '' }]).reset(
  clearFields
)

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
  $containing,
  $answerExample,
  $correctAnswerInputs,
  (wording, containing, answerExample, correctAnswerInputs) =>
    wording &&
    containing &&
    answerExample &&
    correctAnswerInputs.reduce((acc, input) => acc && !!input.value, true)
)

export const $form = combine(
  $wording,
  $answerExample,
  $containing,
  $correctAnswerInputs,
  $audioFiles,
  (wording, example_answer, containing, inputs, audio) => {
    return {
      wording,
      example_answer,
      text: containing,
      question_data: null,
      correct_answer: inputs.map(({ value }) => value),
      common_list_text_answer: null,
      audio: audio.map(({ id, isLimited, limit }) => ({
        id,
        ...(isLimited ? { audio_limit_count: limit } : {}),
      })),
    }
  }
)

export const initAssignment = createEvent<TestAssignment>()

forward({
  from: initAssignment,
  to: [
    setWording.prepend((data) => data.wording || ''),
    setContaining.prepend((data) => data.text || ''),
    setAnswerExample.prepend((data) => data.example_answer || ''),
    // setLanguage.prepend((data) => ({
    //   name: data.interface_language,
    //   title: data.interface_language,
    // })),
    setCorrectAnswerInputs.prepend((data) =>
      data.correct_answer.map((value: string, idx: number) => ({
        id: idx + 1,
        value,
      }))
    ),
  ],
})
