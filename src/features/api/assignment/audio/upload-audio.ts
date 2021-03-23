import { createApiEffect } from '@/features/api/common/create-api-effect'
import { AssignmentAudioFile } from '@/features/api/assignment/types'

export const uploadAudioFx = createApiEffect<AssignmentAudioFile, AssignmentAudioFile>({
  requestMapper: (params) => ({
    method: 'POST',
    url: '/api/assignment/assignment-audio/',
    body: params,
  }),
})
