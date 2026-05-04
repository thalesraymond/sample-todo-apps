import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { registerEnvironment } from './config/environment.js'
import { registerHelmet } from './plugins/helmet.plugin.js'
import { registerCors } from './plugins/cors.plugin.js'
import { registerRateLimit } from './plugins/rate-limit.plugin.js'
import { registerAuth } from './plugins/auth.plugin.js'
import { registerDatabase } from './plugins/database.plugin.js'
import { registerSwagger } from './plugins/swagger.plugin.js'
import { registerErrorHandler } from './shared/errors/error-handler.js'
import { healthRoutes } from './features/health/health.route.js'
import { registerAuthRoutes } from './features/auth/auth.route.js'
import { registerTodo } from './plugins/todo.plugin.js'

export interface BuildAppOptions {
  logger?: boolean
}

export async function buildApp(options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({
    logger: options.logger ?? true,
    pluginTimeout: 60000,
  })

  await registerEnvironment(app)
  await app.register(registerDatabase)

  registerErrorHandler(app)

  await registerSwagger(app)
  await registerHelmet(app)
  await registerRateLimit(app)

  await app.register(fastifyJwt, {
    secret: app.config.JWT_SECRET,
  })

  await app.register(registerAuth)

  await registerCors(app)

  await app.register(healthRoutes)
  await app.register(registerAuthRoutes, { prefix: '/api/auth' })
  await app.register(registerTodo)

  return app
}
