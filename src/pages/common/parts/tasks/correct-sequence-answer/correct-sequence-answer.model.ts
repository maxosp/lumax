import { createEvent, forward, restore, attach, createEffect, combine, sample } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { addToast, successToastEvent } from '@/features/toasts/toasts.model'
import { getRandomId } from '@/pages/common/parts/tasks/utils'
import { UploadMediaResponse } from '@/features/api/media/types'
import { AudioFile, CorrectSequenceQuestion } from '@/pages/common/parts/tasks/types'
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

export const setQuestions = createEvent<CorrectSequenceQuestion[]>()
export const $questions = restore(setQuestions, [
  { id: getRandomId(), question: '', order: 0 },
]).reset(clearFields)

export const toggleReorderEnabling = createEvent<boolean>()
export const $reorderEnabled = restore(toggleReorderEnabling, true).reset(clearFields)

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
  $questions,
  (wording, containing, answerExample, questions) =>
    wording &&
    containing &&
    answerExample &&
    questions.length &&
    questions.reduce((acc, question) => acc && !!question.question, true)
)

export const $form = combine(
  $wording,
  $answerExample,
  $containing,
  $questions,
  $audioFiles,
  (wording, example_answer, containing, questions, audio) => ({
    wording,
    example_answer,
    text: containing,
    question_data: questions.map(({ question }) => question),
    correct_answer: questions.sort((a, b) => a.order - b.order).map((q) => q.question),
    common_list_text_answer: null,
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
    setQuestions.prepend((data) =>
      data.correct_answer.map((question: string, idx: number) => ({
        id: idx + 1,
        order: idx,
        question,
      }))
    ),
  ],
})
