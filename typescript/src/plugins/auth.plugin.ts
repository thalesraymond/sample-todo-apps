import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'
import { UnauthorizedError } from '../shared/errors/http-error.js'
import '../shared/types/index.js'

function isPublicRoute(request: FastifyRequest): boolean {
  return request.routeOptions.config.public === true
}

declare module 'fastify' {
  interface FastifyRequest {
    user: { id: string; email: string }
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string; email: string }
    user: { id: string; email: string }
  }
}

async function authHook(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  if (isPublicRoute(request)) {
    return
  }

  try {
    await request.jwtVerify()
  } catch {
    throw new UnauthorizedError('Authentication required')
  }
}

async function authPlugin(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', authHook)
}

export const registerAuth = fp(authPlugin, {
  name: 'auth-plugin',
})
