import { describe, it, expect } from 'vitest'
import { buildApp } from '../../src/app.js'

describe('buildApp', () => {
  it('should enable logger by default when no options provided', async () => {
    const app = await buildApp()

    expect(app.log).toBeDefined()
    await app.close()
  })

  it('should disable logger when logger option is false', async () => {
    const app = await buildApp({ logger: false })

    expect(app.log).toBeDefined()
    await app.close()
  })

  it('should register the health route', async () => {
    const app = await buildApp({ logger: false })

    const response = await app.inject({
      method: 'GET',
      url: '/health',
    })

    expect(response.statusCode).toBe(200)
    await app.close()
  })
})
