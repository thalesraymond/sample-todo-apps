import type { TodoRepository } from '../domain/todo-repository.js'
import { TodoId } from '../domain/todo-id.js'
import { TodoTitle } from '../domain/todo-title.js'

export interface UpdateTodoInput {
  title?: string
  completed?: boolean
}

export class UpdateTodoUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async execute(id: string, input: UpdateTodoInput, userId: string) {
    try {
      const todoId = TodoId.fromString(id)
      const todo = await this.repository.findById(todoId, userId)

      if (!todo) return null

      if (input.title) {
        todo.updateTitle(TodoTitle.fromString(input.title))
      }

      if (input.completed === true) {
        todo.complete()
      }

      await this.repository.save(todo)
      return todo.toJSON()
    } catch {
      return null
    }
  }
}
