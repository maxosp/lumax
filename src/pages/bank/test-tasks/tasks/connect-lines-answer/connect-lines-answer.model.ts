import { createEvent, forward, restore, attach, createEffect, combine, sample } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { addToast, successToastEvent } from '@/features/toasts/toasts.model'
import { LANGUAGE_DATA } from '@/pages/bank/test-tasks/create/parts/languages-dropdown/constants'
import { getRandomId } from '@/pages/bank/test-tasks/tasks/utils'
import { DropdownItem } from '@/pages/common/types'
import { UploadMediaResponse } from '@/features/api/media/types'
import { AudioFile, ConnectLinesMatch } from '@/pages/bank/test-tasks/tasks/types'
import { TestAssignment } from '@/features/api/assignment/types'

export const uploadMedia = attach({
  effect: uploadMediaFx,
})

export const setWording = createEvent<string>()
export const $wording = restore(setWording, '')

export const setContaining = createEvent<string>()
export const $containing = restore(setContaining, '')

export const setAudioFiles = createEvent<AudioFile[]>()
export const $audioFiles = restore(setAudioFiles, [])

export const setAnswerExample = createEvent<string>()
export const $answerExample = restore(setAnswerExample, '')

export const setMatches = createEvent<ConnectLinesMatch[]>()
export const $matches = restore(setMatches, [{ id: getRandomId(), matchA: '', matchB: '' }])

export const setLanguage = createEvent<DropdownItem>()
export const $language = restore(setLanguage, LANGUAGE_DATA[0])

export const toggleReorderEnabling = createEvent<boolean>()
export const $reorderEnabled = restore(toggleReorderEnabling, false)

export const uploadAudioFiles = createEvent<FileList>()

const uploadAudioFilesFx = createEffect({
  handler: (files: FileList | null): Promise<UploadMediaResponse[]> =>
    Promise.all(
      Array.from(files || []).map(
        (file) =>
          new Promise<UploadMediaResponse>((resolve) => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('file_type', 'audio')
            const res = uploadMedia(formData).then((r) => r.body)
            resolve(res)
          })
      )
    ),
})

forward({
  from: uploadAudioFiles,
  to: [
    uploadAudioFilesFx,
    addToast.prepend(() => ({ type: 'loading', message: 'Идет загрузка файла(ов)' })),
  ],
})

sample({
  source: $audioFiles,
  clock: uploadAudioFilesFx.doneData,
  fn: (existFiles: AudioFile[], newFiles: UploadMediaResponse[]) => {
    successToastEvent('Загрузка завершена')
    return [...existFiles, ...newFiles.map((file) => ({ ...file, isLimited: true, limit: 0 }))]
  },
  target: setAudioFiles,
})

export const $isAudioUploadLoading = uploadAudioFilesFx.pending

export const $isFilled = combine(
  $wording,
  $containing,
  $answerExample,
  $matches,
  (wording, containing, answerExample, matches) =>
    wording &&
    containing &&
    answerExample &&
    matches.reduce((acc, match) => acc && !!match.matchA && !!match.matchB, true)
)

export const $form = combine(
  $wording,
  $answerExample,
  $containing,
  $matches,
  $audioFiles,
  $language,
  (wording, example_answer, containing, matches, audio, language) => ({
    wording,
    text: containing,
    example_answer,
    question_data: matches.map(({ matchA }) => matchA),
    correct_answer: matches.map(({ matchA, matchB }) => ({ [matchA]: matchB })),
    common_list_text_answer: matches.map(({ matchB }) => matchB),
    audio: audio.map(({ id, isLimited, limit }) => ({
      id,
      ...(isLimited ? { audio_limit_count: limit } : {}),
    })),
    interface_language: language.title,
  })
)

export const initAssignment = createEvent<TestAssignment>()

forward({
  from: initAssignment,
  to: [
    setWording.prepend((data) => data.wording || ''),
    setContaining.prepend((data) => data.text || ''),
    setAnswerExample.prepend((data) => data.example_answer || ''),
    setLanguage.prepend((data) => ({
      name: data.interface_language,
      title: data.interface_language,
    })),
    setMatches.prepend((data) =>
      data.correct_answer.map((ca: any, idx: number) => ({
        id: idx + 1,
        matchA: Object.keys(ca)[0],
        matchB: Object.values(ca)[0],
      }))
    ),
  ],
})
