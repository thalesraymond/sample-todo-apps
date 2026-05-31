import { describe, it, expect, vi } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { registerAuthRoutes } from '../../../../src/features/auth/auth.route.js'
import { authHandler } from '../../../../src/features/auth/auth.handler.js'

describe('registerAuthRoutes', () => {
  it('should register POST /register and POST /login routes with public config and correct handlers', async () => {
    const mockApp = {
      post: vi.fn(),
    } as unknown as FastifyInstance

    await registerAuthRoutes(mockApp)

    expect(mockApp.post).toHaveBeenCalledTimes(2)

    expect(mockApp.post).toHaveBeenNthCalledWith(
      1,
      '/register',
      { config: { public: true } },
      authHandler.register,
    )

    expect(mockApp.post).toHaveBeenNthCalledWith(
      2,
      '/login',
      { config: { public: true } },
      authHandler.login,
    )
  })
})
