import { createEvent, forward, restore, attach, combine } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
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

export const setTextTemplate = createEvent<string>()
export const $textTemplate = restore(setTextTemplate, '').reset(clearFields)

export const togglePopover = createEvent<boolean>()
export const $popover = restore(togglePopover, false).reset(clearFields)

export const toggleContextMenu = createEvent<boolean>()
export const $contextMenu = restore(toggleContextMenu, false).reset(clearFields)

export const setColorsPalette = createEvent<string[]>()
export const $colorsPalette = restore(setColorsPalette, []).reset(clearFields)

export const $isFilled = combine(
  $wording,
  $textTemplate,
  $colorsPalette,
  (wording, textTemplate, colorsPalette) =>
    wording && colorsPalette.length && colorsPalette.some((color) => textTemplate.includes(color))
)

export const $form = combine(
  $wording,
  $answerExample,
  $containing,
  $audioFiles,
  $textTemplate,
  $colorsPalette,
  (wording, example_answer, containing, audio, text, colors) => ({
    wording,
    example_answer,
    text: containing,
    question_data: { text, colors },
    correct_answer: text,
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
    setTextTemplate.prepend((data) => data.template_text),
    setColorsPalette.prepend((data) => data.question_data.colors),
    getAudioFilesFx.prepend(({ audios }) => audios),
  ],
})
