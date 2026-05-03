import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildTestServer } from '../helpers/test-server.js'

describe('GET /health', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildTestServer()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 200 with status ok', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ status: 'ok' })
  })

  it('should be accessible without authentication', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    })

    expect(response.statusCode).not.toBe(401)
  })
})

describe('unauthenticated routes', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildTestServer()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 401 for non-public routes', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/nonexistent-protected-route',
    })

    expect(response.statusCode).toBe(401)
  })
})
