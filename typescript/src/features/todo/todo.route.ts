import type { FastifyInstance } from 'fastify'
import { TodoController } from './todo.controller.js'
import type { TodoRepository } from '../../domain/todo-repository.js'

export async function todoRoutes(app: FastifyInstance, options: { repository: TodoRepository }) {
  const controller = new TodoController(options.repository)

  app.post('/', controller.create.bind(controller))
  app.get('/', controller.getAll.bind(controller))
  app.get('/:id', controller.getById.bind(controller))
  app.put('/:id', controller.update.bind(controller))
  app.delete('/:id', controller.delete.bind(controller))
}
