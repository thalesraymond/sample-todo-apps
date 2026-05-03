import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify'
import { registerEnvironment } from './config/environment.js'
import { registerHelmet } from './plugins/helmet.plugin.js'
import { registerCors } from './plugins/cors.plugin.js'
import { registerRateLimit } from './plugins/rate-limit.plugin.js'
import { registerAuth } from './plugins/auth.plugin.js'
import { registerErrorHandler } from './shared/errors/error-handler.js'
import { healthRoutes } from './features/health/health.route.js'
import { registerRoute } from './features/auth/register.route.js'
import { loginRoute } from './features/auth/login.route.js'
import fastifyJwt from '@fastify/jwt'

export interface BuildAppOptions {
  logger?: boolean
}

export async function buildApp(options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({
    logger: options.logger ?? true,
  })

  await registerEnvironment(app)

  registerErrorHandler(app)

  await registerHelmet(app)
  await registerRateLimit(app)

  await app.register(fastifyJwt, {
    secret: app.config.JWT_SECRET,
  })

  await app.register(registerAuth)

  await registerCors(app)

  await app.register(healthRoutes)
  await app.register(registerRoute)
  await app.register(loginRoute)

  return app
}
