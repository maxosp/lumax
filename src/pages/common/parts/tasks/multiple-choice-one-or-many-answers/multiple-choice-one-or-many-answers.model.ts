import { createEvent, forward, restore, attach, combine } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { getRandomId } from '@/pages/common/parts/tasks/utils'
import { MultipleChoiceOneOrManyQuestion } from '@/pages/common/parts/tasks/types'
import { TestAssignment } from '@/features/api/assignment/types'
import { $audioFiles, getAudioFilesFx } from '@/pages/common/parts/audio-files/audio-files.model'

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

export const setQuestionsAnswers = createEvent<MultipleChoiceOneOrManyQuestion[]>()
export const $questionsAnswers = restore(setQuestionsAnswers, [
  { id: getRandomId(), question: '', score: '', isCorrect: false },
]).reset(clearFields)

export const toggleMarksEnabling = createEvent<boolean>()
export const $marksEnabled = restore(toggleMarksEnabling, false).reset(clearFields)

export const $isFilled = combine(
  $wording,
  $questionsAnswers,
  (wording, questionsAnswers) =>
    wording &&
    questionsAnswers.length > 1 &&
    questionsAnswers.every((qa) => qa.question) &&
    questionsAnswers.some((qa) => qa.isCorrect)
)

export const $form = combine(
  $wording,
  $answerExample,
  $containing,
  $questionsAnswers,
  $audioFiles,
  $marksEnabled,
  (wording, example_answer, containing, questionsAnswers, audio, marks) => ({
    wording,
    example_answer,
    text: containing,
    question_data: questionsAnswers.map(({ question }) => question),
    correct_answer: questionsAnswers
      .map((answer, idx) =>
        answer.isCorrect
          ? {
              id: idx,
              score: answer.score,
            }
          : null
      )
      .filter(Boolean),
    common_list_text_answer: null,
    audio: audio.map(({ id, isLimited, limit }) => ({
      id,
      isLimited,
      limit,
    })),
    is_add_score_for_each_answer: marks,
  })
)

export const initAssignment = createEvent<TestAssignment>()

forward({
  from: initAssignment,
  to: [
    setWording.prepend((data) => data.wording || ''),
    setContaining.prepend((data) => data.text || ''),
    setAnswerExample.prepend((data) => data.example_answer || ''),
    toggleMarksEnabling.prepend((data) => data.is_add_score_for_each_answer),
    setQuestionsAnswers.prepend((data) =>
      data.question_data.map((question: string, id: number) => {
        let score = ''
        let isCorrect = false

        const existingCorrectAnswer = data.correct_answer.find(
          (answer: { id: number; score: string }) => answer.id === id
        )
        if (existingCorrectAnswer) {
          isCorrect = true
          if (data.is_add_score_for_each_answer) {
            score = existingCorrectAnswer.score
          }
        }

        return {
          id,
          question,
          isCorrect,
          score,
        }
      })
    ),
    getAudioFilesFx.prepend(({ audios }) => audios),
  ],
})
