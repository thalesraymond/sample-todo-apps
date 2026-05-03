import { MongoClient, type Db } from 'mongodb'
import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import fp from 'fastify-plugin'
import { setDatabase } from '../shared/database.js'

export type DatabasePluginOptions = FastifyPluginOptions

async function databasePlugin(
  app: FastifyInstance,
  _options?: DatabasePluginOptions,
): Promise<void> {
  let uri = app.config.MONGODB_URI
  let mongod: { stop: () => Promise<boolean> } | null = null

  if (app.config.USE_IN_MEMORY_DB) {
    app.log.info('Starting in-memory MongoDB server...')
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server')
      const server = await MongoMemoryServer.create()
      mongod = server
      uri = server.getUri()
      app.log.info(`In-memory MongoDB server started at ${uri}`)
    } catch (error) {
      app.log.error(
        error,
        'Failed to start in-memory MongoDB server. Is mongodb-memory-server installed?',
      )
      throw error
    }
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    app.log.info('Connected to MongoDB')

    const db = client.db()
    setDatabase(db)

    app.decorate('db', db)
    app.decorate('mongoClient', client)

    app.addHook('onClose', async () => {
      app.log.info('Closing MongoDB connection...')
      await client.close()

      if (mongod) {
        app.log.info('Stopping in-memory MongoDB server...')
        await mongod.stop()
      }
    })
  } catch (error) {
    app.log.error(error, 'Failed to connect to MongoDB')
    throw error
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    db: Db
    mongoClient: MongoClient
  }
}

export const registerDatabase = fp(databasePlugin, {
  name: 'database',
})
