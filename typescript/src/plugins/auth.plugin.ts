import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'
import { UnauthorizedError } from '../shared/errors/http-error.js'
import '../shared/types/index.js'

function isPublicRoute(request: FastifyRequest): boolean {
  if (request.method === 'OPTIONS') return true
  return request.routeOptions?.config?.public === true || request.url.startsWith('/docs')
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
  app.addHook('preHandler', authHook)
}

export const registerAuth = fp(authPlugin, {
  name: 'auth-plugin',
})
