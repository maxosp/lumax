import { createEvent, forward, restore, combine } from 'effector-root'
import { $audioFiles, getAudioFilesFx } from '@/pages/common/parts/audio-files/audio-files.model'
import { BaseAssignment } from '@/features/api/assignment/types/types'

export const clearFields = createEvent<void>()

export const setWording = createEvent<string>()
export const $wording = restore(setWording, '').reset(clearFields)

export const setContaining = createEvent<string>()
export const $containing = restore(setContaining, '').reset(clearFields)

export const setAnswerExample = createEvent<string>()
export const $answerExample = restore(setAnswerExample, '').reset(clearFields)

export const toggleBroadAnswerDisabling = createEvent<boolean>()
export const $disableBroadAnswer = restore(toggleBroadAnswerDisabling, false).reset(clearFields)

export const toggleFileAttachmentDisabling = createEvent<boolean>()
export const $disableFileAttachment = restore(toggleFileAttachmentDisabling, false).reset(
  clearFields
)

export const $isFilled = combine(
  $wording,
  $disableBroadAnswer,
  $disableFileAttachment,
  (wording, disableBroadAnswer, disableFileAttachment) =>
    wording && [disableBroadAnswer, disableFileAttachment].includes(false)
)

export const $form = combine(
  $wording,
  $answerExample,
  $containing,
  $disableBroadAnswer,
  $disableFileAttachment,
  $audioFiles,
  (wording, example_answer, containing, disable_field, disable_attach, audio) => ({
    wording,
    example_answer,
    text: containing,
    question_data: {
      disable_field,
      disable_attach,
    },
    correct_answer: null,
    common_list_text_answer: null,
    audio: audio.map(({ id, isLimited, limit }) => ({
      id,
      isLimited,
      limit,
    })),
  })
)

// edition mode data init

export const initAssignment = createEvent<BaseAssignment>()

forward({
  from: initAssignment,
  to: [
    setWording.prepend((data) => data.wording || ''),
    setContaining.prepend((data) => data.text || ''),
    setAnswerExample.prepend((data) => data.example_answer || ''),
    toggleBroadAnswerDisabling.prepend((data) => data.question_data.disable_field),
    toggleFileAttachmentDisabling.prepend((data) => data.question_data.disable_attach),
    getAudioFilesFx.prepend(({ audios }) => audios),
  ],
})
