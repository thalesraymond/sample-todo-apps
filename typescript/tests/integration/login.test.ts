import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildTestServer } from '../helpers/test-server.js'
import { userRepository } from '../../src/features/auth/register.route.js'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'

describe('Login API', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildTestServer()

    const passwordHash = await bcrypt.hash('password123', 10)
    await userRepository.save({
      id: crypto.randomUUID(),
      email: 'loginuser@example.com',
      passwordHash,
    })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should login successfully with valid credentials', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/login',
      payload: {
        email: 'loginuser@example.com',
        password: 'password123',
      },
    })

    expect(response.statusCode).toBe(200)
    const json = response.json()
    expect(json).toHaveProperty('token')
    expect(typeof json.token).toBe('string')
  })

  it('should fail with invalid email', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/login',
      payload: {
        email: 'nonexistent@example.com',
        password: 'password123',
      },
    })

    expect(response.statusCode).toBe(401)
  })

  it('should fail with incorrect password', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/login',
      payload: {
        email: 'loginuser@example.com',
        password: 'wrongpassword',
      },
    })

    expect(response.statusCode).toBe(401)
  })

  it('should return 400 when missing fields', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/login',
      payload: {
        email: 'loginuser@example.com',
      },
    })

    expect(response.statusCode).toBe(400)
  })
})
