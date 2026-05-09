import type { FastifyInstance } from 'fastify'
import fastifyCors from '@fastify/cors'

export async function registerCors(app: FastifyInstance): Promise<void> {
  const origin =
    app.config.CORS_ORIGIN === '*'
      ? '*'
      : app.config.CORS_ORIGIN.split(',').map((o) => o.trim())

  await app.register(fastifyCors, {
    origin,
  })
}
