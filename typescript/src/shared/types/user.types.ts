export interface User {
  id: string
  email: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

export type CreateUserInput = Pick<User, 'email' | 'passwordHash'>
