import type { FastifyInstance } from 'fastify'
import { TodoController } from './todo.controller.js'
import type { TodoRepository } from '../../domain/todo-repository.js'

export async function todoRoutes(app: FastifyInstance, options: { repository: TodoRepository }) {
  const controller = new TodoController(options.repository)

  app.post('/', { config: { public: true } }, controller.create.bind(controller))
  app.get('/', { config: { public: true } }, controller.getAll.bind(controller))
  app.get('/:id', { config: { public: true } }, controller.getById.bind(controller))
  app.put('/:id', { config: { public: true } }, controller.update.bind(controller))
  app.delete('/:id', { config: { public: true } }, controller.delete.bind(controller))
}
