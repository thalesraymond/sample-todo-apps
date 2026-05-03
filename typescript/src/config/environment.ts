import type { FastifyInstance } from 'fastify'
import fastifyEnv from '@fastify/env'

const environmentSchema = {
  type: 'object',
  required: [],
  properties: {
    PORT: {
      type: 'number',
      default: 3000,
    },
    HOST: {
      type: 'string',
      default: '0.0.0.0',
    },
    NODE_ENV: {
      type: 'string',
      default: 'development',
    },
    LOG_LEVEL: {
      type: 'string',
      default: 'info',
    },
    CORS_ORIGIN: {
      type: 'string',
      default: '*',
    },
    JWT_SECRET: {
      type: 'string',
      default: 'supersecret_change_me_in_production',
    },
  },
} as const

export interface EnvironmentConfig {
  PORT: number
  HOST: string
  NODE_ENV: string
  LOG_LEVEL: string
  CORS_ORIGIN: string
  JWT_SECRET: string
}

declare module 'fastify' {
  interface FastifyInstance {
    config: EnvironmentConfig
  }
}

export async function registerEnvironment(app: FastifyInstance): Promise<void> {
  await app.register(fastifyEnv, {
    schema: environmentSchema,
    dotenv: true,
  })
}
