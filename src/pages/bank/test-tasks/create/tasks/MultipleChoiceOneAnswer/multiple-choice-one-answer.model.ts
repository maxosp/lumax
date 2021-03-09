import { createEvent, forward, restore, attach, createEffect, combine } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { addToast } from '@/features/toasts/toasts.model'
import { LANGUAGE_DATA } from '@/pages/bank/test-tasks/create/parts/languages-dropdown/constants'
import { getRandomId } from '@/pages/bank/test-tasks/create/tasks/utils'
import { DropdownItem } from '@/pages/common/types'
import { UploadMediaResponse } from '@/features/api/media/types'
import {
  AudioFile,
  MultipleChoiceOneOrManyQuestion,
} from '@/pages/bank/test-tasks/create/tasks/types'

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
  { id: getRandomId(), question: '', mark: '', isCorrect: true },
])

export const setLanguage = createEvent<DropdownItem>()
export const $language = restore(setLanguage, LANGUAGE_DATA[0])

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

export const $isFilled = combine(
  $wording,
  $containing,
  $answerExample,
  $questionsAnswers,
  (wording, containing, answerExample, questionsAnswers) =>
    wording &&
    containing &&
    answerExample &&
    questionsAnswers.length &&
    questionsAnswers.reduce((acc, qa) => acc && !!qa.question, true)
)

export const $form = combine(
  $wording,
  $answerExample,
  $containing,
  $questionsAnswers,
  $audioFiles,
  $language,
  (wording, example_answer, containing, questionsAnswers, audio, language) => ({
    wording,
    example_answer,
    text: containing,
    question_data: {
      variants: questionsAnswers.map(({ question }) => question),
    },
    correct_answer: questionsAnswers
      .map((q, idx) => (q.isCorrect ? `${idx}` : null))
      .filter(Boolean),
    common_list_text_answer: null,
    audio: audio.map(({ id, isLimited, limit }) => ({
      id,
      ...(isLimited ? { audio_limit_count: limit } : {}),
    })),
    interface_language: language.title,
  })
)
