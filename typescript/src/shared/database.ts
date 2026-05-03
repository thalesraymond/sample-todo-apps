import type { Collection, Db } from 'mongodb'
import type { User, CreateUserInput } from '../shared/types/index.js'

let db: Db | null = null

export function setDatabase(database: Db): void {
  db = database
}

export function getUsersCollection(): Collection<User> {
  if (!db) {
    throw new Error('Database not connected')
  }
  return db.collection<User>('users')
}

export const userRepository = {
  async findByEmail(email: string): Promise<User | null> {
    return getUsersCollection().findOne({ email })
  },

  async create(input: CreateUserInput): Promise<User> {
    const now = new Date()
    const user: User = {
      id: Math.random().toString(36).substring(2, 15), // Placeholder ID generation
      ...input,
      createdAt: now,
      updatedAt: now,
    }

    await getUsersCollection().insertOne(user)
    return user
  },
}
