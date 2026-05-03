import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { InMemoryTodoRepository } from '../infrastructure/in-memory-todo-repository.js'
import { todoRoutes } from '../features/todo/todo.route.js'

async function todoPlugin(app: FastifyInstance) {
  const repository = new InMemoryTodoRepository()

  await app.register(todoRoutes, {
    repository,
    prefix: '/todos',
  })
}

export const registerTodo = fp(todoPlugin, {
  name: 'todo-plugin',
})
