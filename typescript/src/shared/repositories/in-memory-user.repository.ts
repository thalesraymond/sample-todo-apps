import type { User, UserRepository } from '../types/user.js'

export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User>

  constructor() {
    this.users = new Map<string, User>()
  }

  async save(user: User): Promise<void> {
    this.users.set(user.email, { ...user })
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.get(email)
    return user ? { ...user } : null
  }
}
