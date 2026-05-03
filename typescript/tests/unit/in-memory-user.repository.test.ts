import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUserRepository } from '../../src/shared/repositories/in-memory-user.repository.js'
import type { User } from '../../src/shared/types/user.js'

describe('InMemoryUserRepository', () => {
  let repository: InMemoryUserRepository

  beforeEach(() => {
    repository = new InMemoryUserRepository()
  })

  it('should save a user and find it by email', async () => {
    const user: User = {
      id: '1',
      email: 'test@example.com',
      passwordHash: 'hash',
    }

    await repository.save(user)
    const foundUser = await repository.findByEmail('test@example.com')

    expect(foundUser).toEqual(user)
  })

  it('should return null when finding a non-existent user', async () => {
    const foundUser = await repository.findByEmail('nonexistent@example.com')

    expect(foundUser).toBeNull()
  })

  it('should update an existing user when saving with the same email', async () => {
    const user: User = {
      id: '1',
      email: 'test@example.com',
      passwordHash: 'hash',
    }

    await repository.save(user)

    const updatedUser: User = {
      id: '1',
      email: 'test@example.com',
      passwordHash: 'newhash',
    }

    await repository.save(updatedUser)

    const foundUser = await repository.findByEmail('test@example.com')
    expect(foundUser?.passwordHash).toBe('newhash')
  })
})
