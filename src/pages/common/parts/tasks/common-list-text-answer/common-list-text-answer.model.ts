import { createEvent, forward, restore, attach, createEffect, combine, sample } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { addToast, successToastEvent } from '@/features/toasts/toasts.model'
import { getRandomId } from '@/pages/common/parts/tasks/utils'
import { DropdownItem } from '@/pages/common/types'
import { UploadMediaResponse } from '@/features/api/media/types'
import { AudioFile, AnswerOption } from '@/pages/common/parts/tasks/types'
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

export const setAnswersOptions = createEvent<AnswerOption[]>()
export const $answersOptions = restore(setAnswersOptions, [
  { id: getRandomId(), name: '', title: '' },
]).reset(clearFields)

export const setCorrectAnswers = createEvent<DropdownItem[]>()
export const $correctAnswers = restore(setCorrectAnswers, []).reset(clearFields)

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
  $containing,
  $answerExample,
  $correctAnswers,
  (wording, containing, answerExample, correctAnswers) =>
    wording &&
    containing &&
    answerExample &&
    correctAnswers.length &&
    correctAnswers.reduce((acc, answer) => acc && !!answer.title, true)
)

export const $form = combine(
  $wording,
  $answerExample,
  $containing,
  $correctAnswers,
  $answersOptions,
  $textTemplate,
  $audioFiles,
  (wording, example_answer, containing, correctAnswers, answersOptions, text_template, audio) => ({
    wording,
    example_answer,
    text: containing,
    question_data: answersOptions.map(({ title }) => title),
    correct_answer: correctAnswers,
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
    setAnswersOptions.prepend((data) =>
      data.question_data.map((value: string, idx: number) => ({
        id: idx + 1,
        name: value,
        title: value,
      }))
    ),
    setCorrectAnswers.prepend((data) => data.correct_answer),
    setTextTemplate.prepend((data) => data.common_list_answer_choices),
  ],
})
