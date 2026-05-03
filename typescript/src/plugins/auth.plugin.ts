import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'
import { UnauthorizedError } from '../shared/errors/http-error.js'
import '../shared/types/index.js'

function isPublicRoute(request: FastifyRequest): boolean {
  return request.routeOptions.config.public === true
}

async function authHook(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  if (isPublicRoute(request)) {
    return
  }

  throw new UnauthorizedError('Authentication required')
}

async function authPlugin(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', authHook)
}

export const registerAuth = fp(authPlugin, {
  name: 'auth-plugin',
})
