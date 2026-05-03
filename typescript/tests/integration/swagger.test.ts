import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildTestServer } from '../helpers/test-server.js'

describe('Swagger Documentation', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildTestServer()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should serve Swagger UI at /docs', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/docs',
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('text/html')
  })

  it('should serve OpenAPI JSON at /docs/json', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/docs/json',
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')

    const json = response.json()
    expect(json.openapi).toMatch(/^3\.0\./)
    expect(json.info.title).toBe('Todo List API')
    expect(json.paths).toHaveProperty('/health')
  })

  it('should be accessible without authentication', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/docs',
    })

    expect(response.statusCode).not.toBe(401)
  })
})
