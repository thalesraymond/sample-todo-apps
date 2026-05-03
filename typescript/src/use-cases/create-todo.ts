import type { TodoRepository } from '../domain/todo-repository.js'
import { Todo } from '../domain/todo.js'
import { TodoTitle } from '../domain/todo-title.js'

export interface CreateTodoInput {
  title: string
}

export class CreateTodoUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async execute(input: CreateTodoInput) {
    const title = TodoTitle.fromString(input.title)
    const todo = Todo.create(title)
    await this.repository.save(todo)
    return todo.toJSON()
  }
}
