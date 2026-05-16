import { describe, it, expect, beforeEach } from 'vitest'
import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify'
import { registerErrorHandler } from '../../../../src/shared/errors/error-handler.js'
import { BadRequestError } from '../../../../src/shared/errors/http-error.js'

describe('error-handler', () => {
  let app: FastifyInstance

  beforeEach(() => {
    app = Fastify({ logger: false })
    registerErrorHandler(app)
  })

  it('should handle validation errors', async () => {
    app.get(
      '/validation',
      {
        schema: {
          querystring: {
            type: 'object',
            required: ['id'],
            properties: {
              id: { type: 'string' },
            },
          },
        },
      },
      async () => {
        return { ok: true }
      },
    )

    const response = await app.inject({
      method: 'GET',
      url: '/validation',
    })

    expect(response.statusCode).toBe(400)
    expect(response.json()).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: "querystring must have required property 'id'",
    })
  })

  it('should handle HttpError', async () => {
    app.get('/http-error', async () => {
      throw new BadRequestError('Custom bad request message')
    })

    const response = await app.inject({
      method: 'GET',
      url: '/http-error',
    })

    expect(response.statusCode).toBe(400)
    expect(response.json()).toEqual({
      statusCode: 400,
      error: 'BadRequestError',
      message: 'Custom bad request message',
    })
  })

  it('should handle generic Error as Internal Server Error', async () => {
    app.get('/generic-error', async () => {
      throw new Error('Something went terribly wrong')
    })

    const response = await app.inject({
      method: 'GET',
      url: '/generic-error',
    })

    expect(response.statusCode).toBe(500)
    expect(response.json()).toEqual({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    })
  })
})
