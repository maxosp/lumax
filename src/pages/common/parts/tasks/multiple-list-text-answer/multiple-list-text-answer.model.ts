import { createEvent, forward, restore, attach, combine } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { MultipleListTextAnswer, QuestionData } from '@/pages/common/parts/tasks/types'
import { $audioFiles, getAudioFilesFx } from '@/pages/common/parts/audio-files/audio-files.model'
import { TestAssignment } from '@/features/api/assignment/types/test-assignments-types'

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

export const setAnswersList = createEvent<MultipleListTextAnswer[]>()
export const $answersList = restore(setAnswersList, []).reset(clearFields)

export const setTextTemplate = createEvent<string>()
export const $textTemplate = restore(setTextTemplate, '').reset(clearFields)

export const toggleReorderEnabling = createEvent<boolean>()
export const $reorderEnabled = restore(toggleReorderEnabling, false).reset(clearFields)

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
  $reorderEnabled,
  (wording, example_answer, containing, answersList, text_template, audio, reorderEnabled) => ({
    wording,
    example_answer,
    text: containing,
    question_data: {
      variants: answersList.map((list, idx) => ({
        number: idx + 1,
        options: list.answers.map(({ value }) => value),
      })),
      disable_shuffle: reorderEnabled,
    },
    correct_answer: answersList.map((list) => list.answers.findIndex(({ isCorrect }) => isCorrect)),
    template_text: text_template,
    audio: audio.map(({ id, isLimited, limit }) => ({
      id,
      isLimited,
      limit,
    })),
  })
)

export const initAssignment = createEvent<TestAssignment>()

forward({
  from: initAssignment,
  to: [
    setWording.prepend(({ wording }) => wording || ''),
    setTextTemplate.prepend(({ template_text }) => template_text || ''),
    setAnswerExample.prepend(({ example_answer }) => example_answer || ''),
    setContaining.prepend(({ text }) => text || ''),
    setAnswersList.prepend((data) =>
      data.question_data.variants.map((variant: QuestionData, idx: number) => ({
        id: idx + 1,
        answers: variant.options.map((value: string, index: number) => {
          let isCorrect = false
          if (data.correct_answer[idx] === index) {
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
    toggleReorderEnabling.prepend((data) => data.question_data.disable_shuffle),
    getAudioFilesFx.prepend(({ audios }) => audios),
  ],
})
