import { createEvent, forward, restore, attach, combine } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { ShortClosedAnswer } from '@/pages/common/parts/tasks/types'
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

export const setCorrectAnswerInputs = createEvent<ShortClosedAnswer[]>()
export const $correctAnswerInputs = restore(setCorrectAnswerInputs, [{ id: 0, value: '' }]).reset(
  clearFields
)

export const $isFilled = combine(
  $wording,
  $correctAnswerInputs,
  (wording, correctAnswerInputs) =>
    wording && correctAnswerInputs.length && correctAnswerInputs.every((input) => input.value)
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
        isLimited,
        limit,
      })),
    }
  }
)

export const initAssignment = createEvent<TestAssignment>()

forward({
  from: initAssignment,
  to: [
    setWording.prepend(({ wording }) => wording || ''),
    setContaining.prepend(({ text }) => text || ''),
    setAnswerExample.prepend(({ example_answer }) => example_answer || ''),
    setCorrectAnswerInputs.prepend(({ correct_answer }) =>
      correct_answer
        ? correct_answer.map((value: string, idx: number) => ({
            id: idx + 1,
            value,
          }))
        : null
    ),
    getAudioFilesFx.prepend(({ audios }) => audios),
  ],
})
