import { afterAll, beforeAll } from 'vitest'

beforeAll(() => {
  process.env['USE_IN_MEMORY_DB'] = 'true'
  process.env['JWT_SECRET'] = 'test-secret'
})

afterAll(() => {
  // Global cleanup for all test suites
})
