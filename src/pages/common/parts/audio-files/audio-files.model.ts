import { attach, createEffect, createEvent, forward, restore, sample } from 'effector'
import { uploadMediaFx } from '@/features/api/media/upload-media'
import { UploadMediaResponse } from '@/features/api/media/types'
import { AudioFile } from '@/pages/common/parts/tasks/types'
import { addToast } from '@/features/toasts/toasts.model'
import { getMediaFx } from '@/features/api/media/get-media'
import { AssignmentAudioFile } from '@/features/api/assignment/types'

export const uploadMedia = attach({
  effect: uploadMediaFx,
})

const getMedia = attach({
  effect: getMediaFx,
})

export const clearFields = createEvent<void>()

export const setAudioFiles = createEvent<AudioFile[]>()
export const $audioFiles = restore(setAudioFiles, []).reset(clearFields)

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

export const getAudioFilesFx = createEffect({
  handler: (files: AssignmentAudioFile[]): Promise<AudioFile[]> => {
    return Promise.all(
      files.map(
        ({ media, audio_limit_count }) =>
          new Promise<AudioFile>((resolve) => {
            const res = getMedia(media!).then((r) => {
              return {
                ...r.body,
                isLimited: audio_limit_count! === null,
                limit: audio_limit_count || 0,
              }
            })
            resolve(res)
          })
      )
    )
  },
})

forward({
  from: getAudioFilesFx.doneData,
  to: setAudioFiles.prepend((audios) => audios.map((audio) => audio)),
})

forward({
  from: uploadAudioFiles,
  to: [
    uploadAudioFilesFx,
    addToast.prepend(() => ({ type: 'loading', message: 'Идет загрузка файла(ов)' })),
  ],
})

forward({
  from: uploadAudioFilesFx.doneData,
  to: addToast.prepend(() => ({ type: 'success', message: 'Загрузка завершена!' })),
})

sample({
  source: $audioFiles,
  clock: uploadAudioFilesFx.doneData,
  fn: (existFiles: AudioFile[], newFiles: UploadMediaResponse[]) => {
    return [...existFiles, ...newFiles.map((file) => ({ ...file, isLimited: false, limit: 1 }))]
  },
  target: setAudioFiles,
})

export const $isAudioUploadLoading = uploadAudioFilesFx.pending
