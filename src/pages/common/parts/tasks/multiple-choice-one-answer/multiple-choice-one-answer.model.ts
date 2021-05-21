import { createEvent, forward, restore, attach, combine } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { getRandomId } from '@/pages/common/parts/tasks/utils'
import { MultipleChoiceOneAnswer } from '@/pages/common/parts/tasks/types'
import { $audioFiles, getAudioFilesFx } from '@/pages/common/parts/audio-files/audio-files.model'
import { BaseAssignment } from '@/features/api/assignment/types/types'

export const uploadMedia = attach({
  effect: uploadMediaFx,
})

export const clearFields = createEvent<void>()

export const setWording = createEvent<string>()
export const $wording = restore(setWording, '').reset(clearFields)

export const setContaining = createEvent<string>()
export const $containing = restore(setContaining, '').reset(clearFields)

export const setAnswerExample = createEvent<string>()
export const $answerExample = restore(setAnswerExample, '').reset(clearFields)

export const setQuestionsAnswers = createEvent<MultipleChoiceOneAnswer[]>()
export const $questionsAnswers = restore(setQuestionsAnswers, [
  { id: getRandomId(), answer: '', isCorrect: true },
]).reset(clearFields)

export const $isFilled = combine(
  $wording,
  $questionsAnswers,
  (wording, questionsAnswers) =>
    wording &&
    questionsAnswers.length > 1 &&
    questionsAnswers.every((qa) => qa.answer) &&
    questionsAnswers.some((qa) => qa.isCorrect)
)

export const $form = combine(
  $wording,
  $answerExample,
  $containing,
  $questionsAnswers,
  $audioFiles,
  (wording, example_answer, containing, questionsAnswers, audio) => ({
    wording,
    example_answer,
    text: containing,
    question_data: {
      variants: questionsAnswers.map(({ answer }) => answer),
    },
    correct_answer: questionsAnswers.findIndex((qa) => qa.isCorrect),
    common_list_text_answer: null,
    audio: audio.map(({ id, isLimited, limit }) => ({
      id,
      isLimited,
      limit,
    })),
  })
)

export const initAssignment = createEvent<BaseAssignment>()

forward({
  from: initAssignment,
  to: [
    setWording.prepend((data) => data.wording || ''),
    setContaining.prepend((data) => data.text || ''),
    setAnswerExample.prepend((data) => data.example_answer || ''),
    setQuestionsAnswers.prepend((data) =>
      data.question_data.variants.map((answer: string, idx: number) => ({
        id: idx + 1,
        answer,
        isCorrect: data.correct_answer === idx,
      }))
    ),
    getAudioFilesFx.prepend(({ audios }) => audios),
  ],
})
