import { createApiEffect } from '@/features/api/common/create-api-effect'
import { AssignmentAudioFile } from '@/features/api/assignment/types/types'

export const uploadAudioFx = createApiEffect<AssignmentAudioFile, AssignmentAudioFile>({
  requestMapper: (params) => ({
    method: 'POST',
    url: '/api/assignment-app/assignment-audio/',
    body: params,
  }),
})
