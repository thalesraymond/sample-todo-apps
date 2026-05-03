import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildTestServer } from '../helpers/test-server.js'

describe('Registration API', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildTestServer()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should register a new user successfully', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/register',
      payload: {
        email: 'test@example.com',
        password: 'password123',
      },
    })

    expect(response.statusCode).toBe(201)
    const json = response.json()
    expect(json).toHaveProperty('id')
    expect(json.email).toBe('test@example.com')
    expect(json).not.toHaveProperty('passwordHash')
    expect(json).not.toHaveProperty('password')
  })

  it('should fail when registering with an existing email', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/register',
      payload: {
        email: 'duplicate@example.com',
        password: 'password123',
      },
    })

    const response = await app.inject({
      method: 'POST',
      url: '/api/register',
      payload: {
        email: 'duplicate@example.com',
        password: 'password456',
      },
    })

    expect(response.statusCode).toBe(409)
  })

  it('should fail validation with invalid email', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/register',
      payload: {
        email: 'invalid-email',
        password: 'password123',
      },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should fail validation with missing password', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/register',
      payload: {
        email: 'test3@example.com',
      },
    })

    expect(response.statusCode).toBe(400)
  })
})
