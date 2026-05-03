import { buildApp } from './app.js'

async function start(): Promise<void> {
  const app = await buildApp()

  const host = app.config.HOST
  const port = app.config.PORT

  await app.listen({ host, port })
}

start().catch((error: unknown) => {
  const logger = console
  logger.error('Failed to start server:', error)
  process.exit(1)
})
