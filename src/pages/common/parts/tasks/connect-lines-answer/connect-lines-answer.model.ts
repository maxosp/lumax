import { createEvent, forward, restore, attach, combine } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { getRandomId } from '@/pages/common/parts/tasks/utils'
import { ConnectLinesMatch } from '@/pages/common/parts/tasks/types'
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

export const setMatches = createEvent<ConnectLinesMatch[]>()
export const $matches = restore(setMatches, [{ id: getRandomId(), matchA: '', matchB: '' }]).reset(
  clearFields
)

export const toggleReorderEnabling = createEvent<boolean>()
export const $reorderEnabled = restore(toggleReorderEnabling, false).reset(clearFields)

export const $isFilled = combine(
  $wording,
  $matches,
  (wording, matches) => wording && matches.every((match) => match.matchA && match.matchB)
)

export const $form = combine(
  $wording,
  $answerExample,
  $containing,
  $matches,
  $audioFiles,
  $reorderEnabled,
  (wording, example_answer, containing, matches, audio, reorderEnabled) => ({
    wording,
    text: containing,
    example_answer,
    question_data: {
      options: matches.map(({ matchA }) => matchA),
      disable_shuffle: reorderEnabled,
    },
    correct_answer: matches.map(({ matchA, matchB }) => ({ [matchA]: matchB })),
    common_list_text_answer: matches.map(({ matchB }) => matchB),
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
    setMatches.prepend((data) =>
      data.correct_answer.map((ca: any, idx: number) => ({
        id: idx + 1,
        matchA: Object.keys(ca)[0],
        matchB: Object.values(ca)[0],
      }))
    ),
    toggleReorderEnabling.prepend((data) => data.question_data.disable_shuffle),
    getAudioFilesFx.prepend(({ audios }) => audios),
  ],
})
