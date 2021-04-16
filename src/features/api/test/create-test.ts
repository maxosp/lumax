import { createApiEffect } from '@/features/api/common/create-api-effect'
import { CreateTestFxParams, Test } from './types'

export const createTestFx = createApiEffect<CreateTestFxParams, Test>({
  requestMapper: (body) => ({
    method: 'POST',
    url: '/api/test/test/',
    body,
  }),
})
