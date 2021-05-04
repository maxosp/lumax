import { uploadAudioFx } from '@/features/api/assignment/audio/upload-audio'
import { AssignmentAudioFile } from '@/features/api/assignment/types'
import { createEffect } from 'effector'
import { AudioFile } from '@/pages/common/parts/tasks/types'

export const uploadAudioFiles = createEffect({
  handler: (audioFiles: AudioFile[]): Promise<AssignmentAudioFile[]> =>
    Promise.all(
      audioFiles.map(
        (file) =>
          new Promise<AssignmentAudioFile>((resolve) => {
            const res = uploadAudioFx({
              media: file.id,
              ...(!file.isLimited ? { audio_limit_count: file.limit } : {}),
            }).then((r) => r.body)
            resolve(res)
          })
      )
    ),
})
