import type { TodoRepository } from '../domain/todo-repository.js'
import { TodoId } from '../domain/todo-id.js'

export class GetTodosUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async execute() {
    const todos = await this.repository.findAll()
    return todos.map((todo) => todo.toJSON())
  }
}

export class GetTodoByIdUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async execute(id: string) {
    try {
      const todoId = TodoId.fromString(id)
      const todo = await this.repository.findById(todoId)
      return todo ? todo.toJSON() : null
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes('id')) {
        return null
      }
      throw error
    }
  }
}
