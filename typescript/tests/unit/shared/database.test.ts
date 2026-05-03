import { describe, it, expect } from 'vitest'
import { getUsersCollection } from '../../../src/shared/database.js'

describe('Shared Database', () => {
  it('should throw error if database not connected', () => {
    expect(() => getUsersCollection()).toThrow('Database not connected')
  })
})
