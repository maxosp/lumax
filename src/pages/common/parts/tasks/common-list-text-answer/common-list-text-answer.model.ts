import { createEvent, forward, restore, attach, combine } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { getRandomId } from '@/pages/common/parts/tasks/utils'
import { DropdownItem } from '@/pages/common/types'
import { AnswerOption } from '@/pages/common/parts/tasks/types'
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

export const setAnswersOptions = createEvent<AnswerOption[]>()
export const $answersOptions = restore(setAnswersOptions, [
  { id: getRandomId(), name: '', title: '' },
]).reset(clearFields)

export const setCorrectAnswers = createEvent<DropdownItem[]>()
export const $correctAnswers = restore(setCorrectAnswers, []).reset(clearFields)

export const setTextTemplate = createEvent<string>()
export const $textTemplate = restore(setTextTemplate, '').reset(clearFields)

export const toggleReorderEnabling = createEvent<boolean>()
export const $reorderEnabled = restore(toggleReorderEnabling, false).reset(clearFields)

export const $isFilled = combine(
  $wording,
  $answersOptions,
  $correctAnswers,
  (wording, answersOptions, correctAnswers) =>
    wording &&
    answersOptions.some((op) => op.title) &&
    correctAnswers.length &&
    correctAnswers.every(
      (answer) => answer.title && answersOptions.some((ao) => ao.title === answer.title)
    )
)

export const $form = combine(
  $wording,
  $answerExample,
  $containing,
  $correctAnswers,
  $answersOptions,
  $textTemplate,
  $audioFiles,
  $reorderEnabled,
  (
    wording,
    example_answer,
    containing,
    correctAnswers,
    answersOptions,
    template_text,
    audio,
    reorderEnabled
  ) => ({
    wording,
    example_answer,
    text: containing,
    question_data: {
      options: answersOptions.map(({ title }) => title),
      disable_shuffle: reorderEnabled,
    },
    correct_answer: correctAnswers.map((answer) =>
      answersOptions.findIndex((option) => option.name === answer.name)
    ),
    template_text,
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
    setWording.prepend((data) => data.wording || ''),
    setContaining.prepend((data) => data.text || ''),
    setAnswerExample.prepend((data) => data.example_answer || ''),
    setAnswersOptions.prepend((data) =>
      data.question_data.options.map((value: string, idx: number) => ({
        id: idx + 1,
        name: value,
        title: value,
      }))
    ),
    setCorrectAnswers.prepend((data) =>
      data.correct_answer.map((value: string, index: number) => ({
        id: index + 1,
        title: data.question_data.options[+value],
      }))
    ),
    setTextTemplate.prepend((data) => data.template_text),
    toggleReorderEnabling.prepend((data) => data.question_data.disable_shuffle),
    getAudioFilesFx.prepend(({ audios }) => audios),
  ],
})
