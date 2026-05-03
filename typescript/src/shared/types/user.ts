export interface User {
  id: string
  email: string
  passwordHash: string
}

export interface UserRepository {
  save(user: User): Promise<void>
  findByEmail(email: string): Promise<User | null>
}
