import { describe, it, expect, beforeEach } from 'vitest'
import type { FastifyInstance } from 'fastify'
import Fastify from 'fastify'
import { registerErrorHandler } from '../../../../src/shared/errors/error-handler.js'
import { BadRequestError, NotFoundError } from '../../../../src/shared/errors/http-error.js'

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
    let loggedError: any
    app.log.error = (err) => {
      loggedError = err
    }

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
    expect(loggedError).toBeInstanceOf(Error)
    expect(loggedError.message).toBe('Something went terribly wrong')
  })
  it('should handle other HttpErrors (e.g., NotFoundError)', async () => {
    app.get('/not-found', async () => {
      throw new NotFoundError('Resource not found')
    })

    const response = await app.inject({
      method: 'GET',
      url: '/not-found',
    })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({
      statusCode: 404,
      error: 'NotFoundError',
      message: 'Resource not found',
    })
  })

  it('should handle non-Error throws gracefully', async () => {
    app.get('/non-error', async () => {
      throw null
    })

    const response = await app.inject({
      method: 'GET',
      url: '/non-error',
    })

    expect(response.statusCode).toBe(500)
    expect(response.json()).toEqual({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    })
  })
})
