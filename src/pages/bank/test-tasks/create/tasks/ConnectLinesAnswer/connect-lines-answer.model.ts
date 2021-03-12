import { createEvent, forward, restore, attach, createEffect, combine, sample } from 'effector-root'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { addToast } from '@/features/toasts/toasts.model'
import { LANGUAGE_DATA } from '@/pages/bank/test-tasks/create/parts/languages-dropdown/constants'
import { getRandomId } from '@/pages/bank/test-tasks/create/tasks/utils'
import { DropdownItem } from '@/pages/common/types'
import { UploadMediaResponse } from '@/features/api/media/types'
import { AudioFile, ConnectLinesMatch } from '@/pages/bank/test-tasks/create/tasks/types'

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
    addToast.prepend(() => ({ type: 'success', message: 'Загрузка завершена' }))
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
  (wording, answerExample, containing, matches, audio, language) => ({
    wording,
    text: answerExample,
    containing,
    question_data: matches.map(({ matchA }) => matchA),
    correct_answer: matches.map(({ matchA, matchB }) => ({ [matchA]: matchB })),
    common_list_text_answer: matches.map(({ matchB }) => matchB),
    media: audio,
    interface_language: language.title,
  })
)
