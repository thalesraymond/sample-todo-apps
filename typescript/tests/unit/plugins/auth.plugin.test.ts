import { describe, it, expect, vi } from 'vitest'
import Fastify from 'fastify'
import { registerAuth } from '../../../src/plugins/auth.plugin.js'

describe('auth.plugin', () => {
  it('should skip authentication for OPTIONS requests', async () => {
    const app = Fastify({ logger: false })
    await app.register(registerAuth)
    app.options('/api/test', async () => ({ status: 'ok' }))

    const response = await app.inject({
      method: 'OPTIONS',
      url: '/api/test',
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ status: 'ok' })
  })

  it('should skip authentication for public routes', async () => {
    const app = Fastify({ logger: false })
    await app.register(registerAuth)
    app.get('/api/public', { config: { public: true } }, async () => ({ status: 'public' }))

    const response = await app.inject({
      method: 'GET',
      url: '/api/public',
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ status: 'public' })
  })

  it('should skip authentication for documentation routes', async () => {
    const app = Fastify({ logger: false })
    await app.register(registerAuth)
    app.get('/docs', async () => ({ status: 'docs' }))

    const response = await app.inject({
      method: 'GET',
      url: '/docs',
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ status: 'docs' })
  })

  it('should proceed if jwtVerify resolves successfully', async () => {
    const app = Fastify({ logger: false })
    app.decorateRequest('jwtVerify', vi.fn().mockResolvedValue({}))
    await app.register(registerAuth)
    app.get('/api/private', async () => ({ status: 'private' }))

    const response = await app.inject({
      method: 'GET',
      url: '/api/private',
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ status: 'private' })
  })

  it('should throw UnauthorizedError if jwtVerify fails', async () => {
    const app = Fastify({ logger: false })
    app.decorateRequest('jwtVerify', vi.fn().mockRejectedValue(new Error('Invalid token')))
    await app.register(registerAuth)
    app.get('/api/private', async () => ({ status: 'private' }))

    const response = await app.inject({
      method: 'GET',
      url: '/api/private',
    })

    expect(response.statusCode).toBe(401)
    expect(response.json().message).toBe('Authentication required')
  })
})
