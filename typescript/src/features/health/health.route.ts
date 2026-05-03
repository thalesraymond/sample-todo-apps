import type { FastifyInstance } from 'fastify'
import { healthHandler } from './health.handler.js'
import '../../shared/types/index.js'

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', { config: { public: true } }, healthHandler)
}
