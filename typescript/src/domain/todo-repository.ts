import type { Todo } from './todo.js'
import type { TodoId } from './todo-id.js'

export interface TodoRepository {
  save(todo: Todo): Promise<void>
  findById(id: TodoId, userId: string): Promise<Todo | null>
  findAll(userId: string): Promise<Todo[]>
  delete(id: TodoId, userId: string): Promise<void>
}
