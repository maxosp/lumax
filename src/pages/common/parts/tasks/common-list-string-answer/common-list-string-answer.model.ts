import { createEvent, forward, restore, attach, createEffect, combine, sample } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { addToast, successToastEvent } from '@/features/toasts/toasts.model'
import { getRandomId } from '@/pages/common/parts/tasks/utils'
import { UploadMediaResponse } from '@/features/api/media/types'
import { AudioFile, AnswerOption, CommonListStringQuestion } from '@/pages/common/parts/tasks/types'
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

export const setQuestionsAnswers = createEvent<CommonListStringQuestion[]>()
export const $questionsAnswers = restore(setQuestionsAnswers, [
  { id: getRandomId(), question: '', answer: '' },
]).reset(clearFields)

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
  $answersOptions,
  $questionsAnswers,
  (wording, answersOptions, questionsAnswers) =>
    wording &&
    answersOptions.some((op) => op.title) &&
    questionsAnswers.every(
      (qa) => qa.question && qa.answer && answersOptions.some((ao) => ao.title === qa.answer)
    )
)

export const $form = combine(
  $wording,
  $answerExample,
  $containing,
  $questionsAnswers,
  $answersOptions,
  $audioFiles,
  (wording, example_answer, containing, questionsAnswers, answersOptions, audio) => ({
    wording,
    example_answer,
    text: containing,
    question_data: questionsAnswers.map(({ question }) => question),
    correct_answer: questionsAnswers.map(({ question, answer }) => ({ [question]: answer })),
    common_list_answer_choices: answersOptions.map(({ title }) => title),
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
      data.common_list_answer_choices.map((choice: string, idx: number) => ({
        id: idx + 1,
        name: choice,
        title: choice,
      }))
    ),
    setQuestionsAnswers.prepend((data) =>
      data.correct_answer.map((ca: any, idx: number) => ({
        id: idx + 1,
        question: Object.keys(ca)[0],
        answer: Object.values(ca)[0],
      }))
    ),
  ],
})
