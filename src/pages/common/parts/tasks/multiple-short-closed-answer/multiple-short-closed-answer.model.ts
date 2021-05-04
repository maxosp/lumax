import { createEvent, forward, restore, attach, combine } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { getRandomId } from '@/pages/common/parts/tasks/utils'
import {
  MultipleShortClosedQuestion,
  MultipleShortClosedAnswer,
} from '@/pages/common/parts/tasks/types'
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

export const setQuestionsAnswers = createEvent<MultipleShortClosedQuestion[]>()
export const $questionsAnswers = restore(setQuestionsAnswers, [
  { id: getRandomId(), question: '', answers: [{ id: getRandomId(), value: '', mark: '' }] },
]).reset(clearFields)

export const toggleMarksEnabling = createEvent<boolean>()
export const $marksEnabled = restore(toggleMarksEnabling, false).reset(clearFields)

export const $isFilled = combine(
  $wording,
  $questionsAnswers,
  (wording, questionsAnswers) =>
    wording &&
    questionsAnswers.length &&
    questionsAnswers.every((qa) => qa.question && qa.answers.every((answer) => answer.value))
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
    question_data: null,
    correct_answer: questionsAnswers.map(({ question, answers }) => ({
      question,
      answers: answers.map(({ value, mark }) => ({
        answer: value,
        ...(marks ? { score: mark } : {}),
      })),
    })),
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
      data.correct_answer.map((questionAnswer: MultipleShortClosedQuestion, idx: number) => ({
        id: idx + 1,
        question: questionAnswer.question,
        answers: questionAnswer.answers.map((value: MultipleShortClosedAnswer, index: number) => ({
          id: index + 1,
          value,
        })),
      }))
    ),
    getAudioFilesFx.prepend(({ audios }) => audios),
  ],
})
