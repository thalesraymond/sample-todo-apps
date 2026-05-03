import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildTestServer } from '../helpers/test-server.js'

describe('error handler', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildTestServer()

    app.get('/test/http-error', { config: { public: true } }, async () => {
      const { NotFoundError } = await import('../../src/shared/errors/http-error.js')
      throw new NotFoundError('test resource not found')
    })

    app.get('/test/unexpected-error', { config: { public: true } }, async () => {
      throw new Error('something broke')
    })

    app.post(
      '/test/validation',
      {
        config: { public: true },
        schema: {
          body: {
            type: 'object',
            required: ['name'],
            properties: {
              name: { type: 'string' },
            },
          },
        },
      },
      async (_request, reply) => {
        await reply.send({ ok: true })
      },
    )
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return consistent JSON for HttpError', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/test/http-error',
    })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({
      statusCode: 404,
      error: 'NotFoundError',
      message: 'test resource not found',
    })
  })

  it('should return 500 for unexpected errors', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/test/unexpected-error',
    })

    expect(response.statusCode).toBe(500)
    expect(response.json()).toEqual({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    })
  })

  it('should return 400 for validation errors', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/test/validation',
      payload: {},
    })

    expect(response.statusCode).toBe(400)
    const body = response.json()
    expect(body.statusCode).toBe(400)
    expect(body.error).toBe('Bad Request')
  })
})
