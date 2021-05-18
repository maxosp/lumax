import { createEvent, forward, restore, attach, combine } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import {
  $questionData,
  setupMovingOnImageAnswerDataFx,
} from '@/pages/common/parts/tasks/moving-images-on-image-input-answer/form/moving-images-on-image-answer-form.model'
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

export const $isFilled = combine(
  $wording,
  $questionData,
  (wording, questionData) =>
    wording &&
    questionData.mainImage !== '' &&
    questionData.draggable.length === questionData.droppable.length &&
    (questionData.droppable.length || questionData.inputs.length) &&
    questionData.draggable.every((img) => img.value !== 0) &&
    questionData['draggable-text'].every((input) => input.text !== '') &&
    questionData.inputs.every((input) => input.value.some((value) => value.value !== ''))
)

export const $form = combine(
  $wording,
  $answerExample,
  $containing,
  $audioFiles,
  $questionData,
  (wording, example_answer, containing, audio, questionData) => {
    return {
      wording,
      example_answer,
      text: containing,
      question_data: questionData,
      correct_answer: null,
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
    setWording.prepend((data) => data.wording || ''),
    setContaining.prepend((data) => data.text || ''),
    setAnswerExample.prepend((data) => data.example_answer || ''),
    setupMovingOnImageAnswerDataFx.prepend((data) => data.question_data),
    getAudioFilesFx.prepend(({ audios }) => audios),
  ],
})
