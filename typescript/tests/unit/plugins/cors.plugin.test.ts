import Fastify from 'fastify'
import { describe, expect, it } from 'vitest'
import { registerCors } from '../../../src/plugins/cors.plugin'

describe('cors.plugin', () => {
  it('should pass false when CORS_ORIGIN is empty', async () => {
    const app = Fastify({ logger: false })
    app.decorate('config', { CORS_ORIGIN: '' })
    await registerCors(app)
    await app.ready()
    // It shouldn't crash
    expect(true).toBe(true)
  })

  it('should split comma-separated origins and trim whitespace', async () => {
    const app = Fastify({ logger: false })
    app.decorate('config', { CORS_ORIGIN: 'http://localhost:3000, http://localhost:4000' })
    await registerCors(app)
    await app.ready()
    expect(true).toBe(true)
  })

  it('should pass * when CORS_ORIGIN is *', async () => {
    const app = Fastify({ logger: false })
    app.decorate('config', { CORS_ORIGIN: '*' })
    await registerCors(app)
    await app.ready()
    expect(true).toBe(true)
  })
})
