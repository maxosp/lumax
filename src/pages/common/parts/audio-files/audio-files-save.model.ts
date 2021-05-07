import { uploadAudioFx } from '@/features/api/assignment/audio/upload-audio'
import { AssignmentAudioFile } from '@/features/api/assignment/types'
import { createEffect } from 'effector'
import { AudioFile } from '@/pages/common/parts/tasks/types'
import { updateAudioFx } from '@/features/api/assignment/audio/update-audio'

export const uploadAudioFiles = createEffect({
  handler: (audioFiles: AudioFile[]): Promise<AssignmentAudioFile[]> =>
    Promise.all(
      audioFiles.map(
        ({ id, isLimited, limit }) =>
          new Promise<AssignmentAudioFile>((resolve) => {
            const res = uploadAudioFx({
              media: id,
              audio_limit_count: isLimited ? limit : null,
            }).then((r) => r.body)
            resolve(res)
          })
      )
    ),
})

export const updateAudioFiles = createEffect({
  handler: (audioFiles: AssignmentAudioFile[]): Promise<AssignmentAudioFile[]> =>
    Promise.all(
      audioFiles.map(
        ({ id, media, audio_limit_count }) =>
          new Promise<AssignmentAudioFile>((resolve) => {
            const res = updateAudioFx({
              data: {
                media,
                audio_limit_count,
              },
              id: id!,
            }).then((r) => r.body)
            resolve(res)
          })
      )
    ),
})

export const handleUpdateAudioFilesFx = createEffect({
  handler: ({
    audioAssignments,
    audioFiles,
  }: {
    audioAssignments: AudioFile[]
    audioFiles: AssignmentAudioFile[]
  }): Promise<AssignmentAudioFile[]> =>
    Promise.all(
      audioAssignments.map(async (file) => {
        const existingFile = audioFiles.find((el: AssignmentAudioFile) => file.id === el.media)
        if (existingFile) {
          const res = await updateAudioFiles([
            {
              ...existingFile,
              audio_limit_count: file.isLimited ? +file.limit : null,
            },
          ]).then((r) => r[0])
          return res
        }
        const res = await uploadAudioFiles([file]).then((r) => r[0])
        return res
      })
    ),
})
