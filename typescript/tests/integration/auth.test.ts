import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildApp } from '../../src/app.js'

describe('Authentication Integration', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    // Force in-memory DB for integration tests
    process.env['USE_IN_MEMORY_DB'] = 'true'
    app = await buildApp({ logger: false })
  })

  afterAll(async () => {
    await app.close()
  })

  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'Password123!',
  }

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: testUser,
      })

      expect(response.statusCode).toBe(201)
      expect(response.json()).toHaveProperty('message', 'User registered successfully')
      expect(response.json()).toHaveProperty('userId')
    })

    it('should return 400 when email already exists', async () => {
      // Register first time
      await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: { email: 'duplicate@example.com', password: 'password' },
      })

      // Register second time
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: { email: 'duplicate@example.com', password: 'password' },
      })

      expect(response.statusCode).toBe(400)
      expect(response.json().message).toContain('already registered')
    })

    it('should return 400 when email or password missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: { email: 'missing-password@example.com' },
      })

      expect(response.statusCode).toBe(400)
    })
  })

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: testUser,
      })

      expect(response.statusCode).toBe(200)
      expect(response.json()).toHaveProperty('token')
    })

    it('should return 401 with invalid credentials', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: { email: testUser.email, password: 'wrong-password' },
      })

      expect(response.statusCode).toBe(401)
      expect(response.json().message).toContain('Invalid credentials')
    })
  })
})
