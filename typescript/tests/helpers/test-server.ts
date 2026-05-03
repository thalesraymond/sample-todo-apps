import type { FastifyInstance } from 'fastify'
import { buildApp } from '../../src/app.js'

export async function buildTestServer(): Promise<FastifyInstance> {
  const app = await buildApp({ logger: false })
  return app
}
