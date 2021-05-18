import { createEvent, forward, restore, attach, combine } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { getRandomId } from '@/pages/common/parts/tasks/utils'
import { CorrectSequenceQuestion } from '@/pages/common/parts/tasks/types'
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

export const setQuestions = createEvent<CorrectSequenceQuestion[]>()
export const $questions = restore(setQuestions, [
  { id: getRandomId(), question: '', order: 0 },
]).reset(clearFields)

export const toggleReorderEnabling = createEvent<boolean>()
export const $reorderEnabled = restore(toggleReorderEnabling, true).reset(clearFields)

export const $isFilled = combine(
  $wording,
  $questions,
  (wording, questions) =>
    wording && questions.length > 1 && questions.every((question) => question.question)
)

export const $form = combine(
  $wording,
  $answerExample,
  $containing,
  $questions,
  $audioFiles,
  $reorderEnabled,
  (wording, example_answer, containing, questions, audio, reorderEnabled) => ({
    wording,
    example_answer,
    text: containing,
    question_data: {
      options: questions.map(({ question }) => question),
      disable_shuffle: reorderEnabled,
    },
    correct_answer: questions.sort((a, b) => a.order - b.order).map((q) => q.question),
    common_list_text_answer: null,
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
    setQuestions.prepend((data) =>
      data.correct_answer.map((question: string, idx: number) => ({
        id: idx + 1,
        order: idx,
        question,
      }))
    ),
    toggleReorderEnabling.prepend((data) => data.question_data.disable_shuffle),
    getAudioFilesFx.prepend(({ audios }) => audios),
  ],
})
