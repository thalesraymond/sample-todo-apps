import type { TodoRepository } from '../domain/todo-repository.js'
import { TodoId } from '../domain/todo-id.js'

export class DeleteTodoUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async execute(id: string) {
    const todoId = TodoId.fromString(id)
    await this.repository.delete(todoId)
  }
}
