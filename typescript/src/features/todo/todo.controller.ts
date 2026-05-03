import type { FastifyRequest, FastifyReply } from 'fastify'
import { CreateTodoUseCase } from '../../use-cases/create-todo.js'
import { GetTodosUseCase, GetTodoByIdUseCase } from '../../use-cases/get-todos.js'
import { UpdateTodoUseCase } from '../../use-cases/update-todo.js'
import { DeleteTodoUseCase } from '../../use-cases/delete-todo.js'
import type { TodoRepository } from '../../domain/todo-repository.js'
import { NotFoundError, BadRequestError } from '../../shared/errors/http-error.js'

export class TodoController {
  private readonly createTodoUseCase: CreateTodoUseCase
  private readonly getTodosUseCase: GetTodosUseCase
  private readonly getTodoByIdUseCase: GetTodoByIdUseCase
  private readonly updateTodoUseCase: UpdateTodoUseCase
  private readonly deleteTodoUseCase: DeleteTodoUseCase

  constructor(repository: TodoRepository) {
    this.createTodoUseCase = new CreateTodoUseCase(repository)
    this.getTodosUseCase = new GetTodosUseCase(repository)
    this.getTodoByIdUseCase = new GetTodoByIdUseCase(repository)
    this.updateTodoUseCase = new UpdateTodoUseCase(repository)
    this.deleteTodoUseCase = new DeleteTodoUseCase(repository)
  }

  async create(request: FastifyRequest<{ Body: { title: string } }>, reply: FastifyReply) {
    const result = await this.createTodoUseCase.execute(request.body)
    return reply.status(201).send(result)
  }

  async getAll(_request: FastifyRequest, reply: FastifyReply) {
    const result = await this.getTodosUseCase.execute()
    return reply.send(result)
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const result = await this.getTodoByIdUseCase.execute(request.params.id)
    if (!result) {
      throw new NotFoundError('Todo not found')
    }
    return reply.send(result)
  }

  async update(
    request: FastifyRequest<{
      Params: { id: string }
      Body: { title?: string; completed?: boolean }
    }>,
    reply: FastifyReply,
  ) {
    const result = await this.updateTodoUseCase.execute(request.params.id, request.body)
    if (!result) {
      throw new NotFoundError('Todo not found')
    }
    return reply.send(result)
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await this.deleteTodoUseCase.execute(request.params.id)
      return reply.status(204).send()
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes('id')) {
        throw new BadRequestError('Invalid ID')
      }
      throw error
    }
  }
}
