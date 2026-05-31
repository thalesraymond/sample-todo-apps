import type { FastifyInstance } from 'fastify'
import fastifyCors from '@fastify/cors'

export async function registerCors(app: FastifyInstance): Promise<void> {
  await app.register(fastifyCors, {
    origin:
      app.config.CORS_ORIGIN === '*'
        ? '*'
        : app.config.CORS_ORIGIN
          ? app.config.CORS_ORIGIN.split(',').map((o) => o.trim())
          : false,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  })
}
