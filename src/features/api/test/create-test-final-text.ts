import { createApiEffect } from '@/features/api/common/create-api-effect'
import { FinalText, CreateTestFinalTextFxParams } from '@/features/api/test/types'

export const createTestFinalTextFx = createApiEffect<CreateTestFinalTextFxParams, FinalText>({
  requestMapper: (body) => ({
    method: 'POST',
    url: '/api/test-app/final-text/',
    body,
  }),
})
