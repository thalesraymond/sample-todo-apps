import type { TodoRepository } from '../domain/todo-repository.js'
import type { Todo } from '../domain/todo.js'
import type { TodoId } from '../domain/todo-id.js'

export class InMemoryTodoRepository implements TodoRepository {
  private readonly todos = new Map<string, Todo>()
  private readonly userTodos = new Map<string, Set<string>>()

  async save(todo: Todo): Promise<void> {
    const id = todo.toJSON().id
    this.todos.set(id, todo)

    const userId = todo.userId
    let userSet = this.userTodos.get(userId)
    if (!userSet) {
      userSet = new Set<string>()
      this.userTodos.set(userId, userSet)
    }
    userSet.add(id)
  }

  async findById(id: TodoId, userId: string): Promise<Todo | null> {
    const todo = this.todos.get(id.toString())
    if (todo && todo.userId === userId) {
      return todo
    }
    return null
  }

  async findAll(userId: string): Promise<Todo[]> {
    const userSet = this.userTodos.get(userId)
    if (!userSet) {
      return []
    }

    const result: Todo[] = []
    for (const id of userSet) {
      const todo = this.todos.get(id)
      if (todo && todo.userId === userId) {
        result.push(todo)
      }
    }
    return result
  }

  async delete(id: TodoId, userId: string): Promise<void> {
    const todo = this.todos.get(id.toString())
    if (todo && todo.userId === userId) {
      this.todos.delete(id.toString())

      const userSet = this.userTodos.get(userId)
      if (userSet) {
        userSet.delete(id.toString())
        if (userSet.size === 0) {
          this.userTodos.delete(userId)
        }
      }
    }
  }
}
