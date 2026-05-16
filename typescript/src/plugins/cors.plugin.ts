import type { FastifyInstance } from 'fastify'
import fastifyCors from '@fastify/cors'

export async function registerCors(app: FastifyInstance): Promise<void> {
  const allowedOrigins = app.config.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  await app.register(fastifyCors, {
    origin: allowedOrigins,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  })
}
