import type { FastifyInstance } from 'fastify'
import fastifyRateLimit from '@fastify/rate-limit'

const MAX_REQUESTS_PER_WINDOW = 100
const TIME_WINDOW_MS = 60_000

export async function registerRateLimit(app: FastifyInstance): Promise<void> {
  await app.register(fastifyRateLimit, {
    max: MAX_REQUESTS_PER_WINDOW,
    timeWindow: TIME_WINDOW_MS,
  })
}
