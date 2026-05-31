import { afterAll, beforeAll } from 'vitest'

beforeAll(() => {
  process.env['USE_IN_MEMORY_DB'] = 'true'
  process.env['JWT_SECRET'] = 'test-secret-must-be-at-least-32-chars'
  process.env['CORS_ORIGIN'] = 'http://localhost:3000'
})

afterAll(() => {
  // Global cleanup for all test suites
})
