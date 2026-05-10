import type { TodoRepository } from '../domain/todo-repository.js'
import { TodoId } from '../domain/todo-id.js'

export class GetTodosUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async execute(userId: string) {
    const todos = await this.repository.findAll(userId)
    return todos.map((todo) => todo.toJSON())
  }
}

export class GetTodoByIdUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async execute(id: string, userId: string) {
    try {
      const todoId = TodoId.fromString(id)
      const todo = await this.repository.findById(todoId, userId)
      return todo ? todo.toJSON() : null
    } catch {
      return null
    }
  }
}
