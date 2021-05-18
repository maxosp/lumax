import { createApiEffect } from '@/features/api/common/create-api-effect'
import { AssignmentAudioFile } from '@/features/api/assignment/types/types'

export const updateAudioFx = createApiEffect<
  { data: AssignmentAudioFile; id: number },
  AssignmentAudioFile
>({
  requestMapper: (params) => ({
    method: 'PATCH',
    url: `/api/assignment-app/assignment-audio/${params.id}/`,
    body: params.data,
  }),
})
