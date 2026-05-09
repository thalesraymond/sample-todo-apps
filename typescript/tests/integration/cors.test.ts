import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildTestServer } from '../helpers/test-server.js'

describe('CORS', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    // We expect the server to potentially fail to start if CORS_ORIGIN is missing
    // or we might need to set it in the environment for tests
    process.env.CORS_ORIGIN = 'http://localhost:3000'
    app = await buildTestServer()
  })

  afterAll(async () => {
    await app.close()
    delete process.env.CORS_ORIGIN
  })

  it('should NOT have wildcard CORS origin by default', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
      headers: {
        origin: 'http://evil.com',
      },
    })

    // It should not be '*' anymore.
    // When the origin doesn't match, @fastify/cors should not return the header at all.
    expect(response.headers['access-control-allow-origin']).toBeUndefined()
  })

  it('should allow configured origin', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
      headers: {
        origin: 'http://localhost:3000',
      },
    })

    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000')
  })
})
